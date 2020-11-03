from __future__ import print_function
import cx_Oracle
import boto3
import json

def dictFact(cursor):
    cols = [m[0] for m in cursor.description]
    print(cols)
    def createRow(*args):
        return dict(zip(cols, args))


    return createRow

def lambda_handler(event, context):

    # Send post authentication data to Cloudwatch logs
    print ("Authentication successful")
    print ("Trigger function =", event['triggerSource'])
    print ("User pool = ", event['userPoolId'])
    print ("App client ID = ", event['callerContext']['clientId'])
    print ("User ID = ", event['userName'])
    print ("Event: ", event)

    dsn = cx_Oracle.makedsn("allmightydb.c3kp0won1ead.us-east-1.rds.amazonaws.com", 1521, service_name="ORCL")
    connection = cx_Oracle.connect("ADMIN", "ADMIN123456", dsn, encoding="UTF-8")
    cur = connection.cursor()
    
    query = """
    WITH PLAYER_SCORES AS (
    SELECT
        PL.USERNAME,
        AVG(GP.SCORE) AS AVERAGE_SCORE,
        P.TOPIC
    FROM GAME_IS_PLAYED GP
    JOIN GAME_PERIOD P ON P.PERIOD_ID = GP.PERIOD_ID
    JOIN PLAYER PL ON PL.USERNAME = GP.PLAYER_NAME
    GROUP BY PL.USERNAME, P.TOPIC
    )
    , IMPORTANT_SCORES AS (
        SELECT 
            MAX(AVERAGE_SCORE) AS BEST_SCORE,
            MIN(AVERAGE_SCORE) AS WORST_SCORE,
            USERNAME
        FROM PLAYER_SCORES
        GROUP BY USERNAME
    )
    ,
    BEST_TOPIC AS (
    SELECT
        P.TOPIC,
        P.USERNAME
    FROM PLAYER_SCORES P

    JOIN IMPORTANT_SCORES I ON ((I.BEST_SCORE = P.AVERAGE_SCORE))
    )
    , WORST_TOPIC AS (
    SELECT
        P.TOPIC,
        P.USERNAME
    FROM PLAYER_SCORES P

    JOIN IMPORTANT_SCORES I ON ((I.WORST_SCORE = P.AVERAGE_SCORE))
    )
    , TOTAL_GAMES AS (
    SELECT
        COUNT(*) AS GAMES, 
        PLAYER_NAME
    FROM GAME_IS_PLAYED
    GROUP BY PLAYER_NAME
    )
    SELECT 
        T.GAMES AS TOTAL_GAMES_PLAYED,
        P.HIGHSCORE AS BEST_SCORE, 
        B.TOPIC AS BEST_CATEGORY,
        W.TOPIC AS WORST_CATEGORY
    FROM PLAYER P
    JOIN TOTAL_GAMES T ON T.PLAYER_NAME = P.USERNAME
    JOIN BEST_TOPIC B ON P.USERNAME = B.USERNAME
    JOIN WORST_TOPIC W ON W.USERNAME = P.USERNAME

    WHERE P.USERNAME = '""" + event['userName'] + """'"""
    
    cur.execute(query)
    results = []
    cur.rowfactory = dictFact(cur)
    #print(cur.fetchone())


    for result in cur.fetchall():
        results.append(result)
        
    connection.close()
    jsonResults = json.dumps(results)

    return jsonResults

# lambda_handler(json.loads("""
# {
#  "triggerSource": "testTrigger",
#  "userPoolId": "testPool",
#  "userName": "ROY",
#  "callerContext": {
#    "clientId": "12345"
#  },
#  "response": {}
# }"""), None)