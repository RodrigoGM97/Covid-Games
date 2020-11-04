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
    print (event['userName'])
    print(event["periodID"])
    print(event)
    sessionID = event["periodID"]



    dsn = cx_Oracle.makedsn("allmightydb.c3kp0won1ead.us-east-1.rds.amazonaws.com", 1521, service_name="ORCL")
    connection = cx_Oracle.connect("ADMIN", "ADMIN123456", dsn, encoding="UTF-8")
    cur = connection.cursor()
    
    try:
        query = "INSERT INTO GAME_IS_PLAYED (PERIOD_ID, PLAYER_NAME) VALUES (" + str(sessionID) + ", '" + event["userName"] + "')"
        print(query)
        cur.execute(query)
        query = "COMMIT"
        cur.execute(query)
        return "Insertion completed in DB: \n" + str(event)
    except cx_Oracle.DatabaseError as e:
        print(e)
        return "An error ocurred inserting the values: \n" + str(e)

# lambda_handler(json.loads("""
# {
#    "triggerSource": "testTrigger",
#    "userPoolId": "testPool",
#    "userName": "ADMIN",
#    "periodID": "24",
#    "callerContext": {
#    "clientId": "12345"
#    },
#    "response": {}
# }"""), None)