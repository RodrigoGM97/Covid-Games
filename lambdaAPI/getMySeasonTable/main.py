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
    SELECT GAME_IS_PLAYED.PERIOD_ID, TOPIC, SCORE, GAME_PERIOD.DAYS_REMAINING 
    FROM GAME_IS_PLAYED JOIN GAME_PERIOD ON GAME_IS_PLAYED.PERIOD_ID = GAME_PERIOD.PERIOD_ID
    WHERE GAME_IS_PLAYED.PLAYER_NAME = '""" + event['userName'] + """' AND GAME_PERIOD.DAYS_REMAINING >= 1"""
    
    
    
    cur.execute(query)
    results = []
    cur.rowfactory = dictFact(cur)
    #print(cur.fetchone())


    for result in cur.fetchall():
        results.append(result)
        
    connection.close()
    jsonResults = json.dumps(results)

    return jsonResults

#lambda_handler(json.loads("""
#{
#  "triggerSource": "testTrigger",
#  "userPoolId": "testPool",
#  "userName": "ROY",
#  "callerContext": {
#    "clientId": "12345"
#  },
#  "response": {}
#}"""), None)