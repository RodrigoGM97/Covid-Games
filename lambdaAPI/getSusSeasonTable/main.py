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
    SELECT PERIOD_ID, TOPIC, DAYS_REMAINING, TO_CHAR(CREATION_TIMESTAMP, 'YYYY/MM/DD') AS START_DATE
    FROM GAME_PERIOD WHERE GAME_PERIOD.SUBSCRIBABLE = 1 AND GAME_PERIOD.PERIOD_ID NOT IN (SELECT PERIOD_ID FROM GAME_IS_PLAYED WHERE PLAYER_NAME = '""" + event['userName'] + """')
    """
    
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