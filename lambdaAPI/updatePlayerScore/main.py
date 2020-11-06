from __future__ import print_function
import cx_Oracle
import boto3
import json

def verifyScoreUpdate(period, user, cur):
    query = "SELECT SCORE FROM GAME_IS_PLAYED WHERE PERIOD_ID = " + str(period) + " and PLAYER_NAME = '" + user + "'"
    cur.execute(query)
    cur.rowfactory = dictFact(cur)
    newScore = cur.fetchone()

    return newScore["SCORE"]

def dictFact(cursor):
    cols = [m[0] for m in cursor.description]
    #print(cols)
    def createRow(*args):
        return dict(zip(cols, args))


    return createRow

def lambda_handler(event, context):
    print(event)
    sessionID = event["seasonID"]
    userName = event["userName"]
    correctAnswer = event["correctAnswer"]
    betAmount = event["betAmount"]
    changeScoreDict = {
        "0":2,
        "1":4,
        "2":6
    }
    changeScore = changeScoreDict[str(betAmount)]
    
    dsn = cx_Oracle.makedsn("allmightydb.c3kp0won1ead.us-east-1.rds.amazonaws.com", 1521, service_name="ORCL")
    connection = cx_Oracle.connect("ADMIN", "ADMIN123456", dsn, encoding="UTF-8")
    cur = connection.cursor()

    if (correctAnswer == True):
        changeScore = changeScoreDict[str(betAmount)]
        query = """
        UPDATE GAME_IS_PLAYED SET 
        SCORE = SCORE + """ + str(changeScore) +""",
        ANSWERED_QUESTIONS = ANSWERED_QUESTIONS + 1,
        CORRECT_ANSWERS = CORRECT_ANSWERS + 1
        WHERE PERIOD_ID = """ + str(sessionID) + """ AND PLAYER_NAME = '""" + userName + """'
        """
    else:
        changeScore = betAmount
        query = """
        UPDATE GAME_IS_PLAYED SET 
        SCORE = SCORE - """ + str(changeScore) +""",
        ANSWERED_QUESTIONS = ANSWERED_QUESTIONS + 1
        WHERE PERIOD_ID = """ + str(sessionID) + """ AND PLAYER_NAME = '""" + userName + """'
        """

    try:
        print(query)
        cur.execute(query)
        query = "COMMIT"
        cur.execute(query)
        query= "update player set highscore = (select max(score) from game_is_played where player_name = '" + userName + "' ) where username = '" + userName + "'"
        cur.execute(query)
        query = "COMMIT"
        cur.execute(query)

        
        j = {
            "newScore": verifyScoreUpdate(sessionID, userName, cur),
            "seasonID": sessionID,
            "userName": userName
        }
        jsonResponse = json.dumps(j)
        print(jsonResponse)
        return jsonResponse
    except cx_Oracle.DatabaseError as e:
        print(e)
        return "An error ocurred updating the score: \n" + str(e)

# lambda_handler(json.loads("""
# {
#    "seasonID": 11,
#    "userName": "ADMIN",
#    "correctAnswer": true,
#    "betAmount": 2,
#    "response": {}
# }"""), None)