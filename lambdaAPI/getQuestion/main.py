from __future__ import print_function
import cx_Oracle
import boto3
import json
import random

def dictFact(cursor):
    cols = [m[0] for m in cursor.description]
    print(cols)
    def createRow(*args):
        return dict(zip(cols, args))


    return createRow

def lambda_handler(event, context):

    # Send post authentication data to Cloudwatch logs
    # print ("Authentication successful")
    # print ("Trigger function =", event['triggerSource'])
    # print ("User pool = ", event['userPoolId'])
    # print ("App client ID = ", event['callerContext']['clientId'])
    # print ("User ID = ", event['userName'])
    # print ("Event: ", event)

    periodID = event["periodID"]
    topic = event["topic"]

    dsn = cx_Oracle.makedsn("allmightydb.c3kp0won1ead.us-east-1.rds.amazonaws.com", 1521, service_name="ORCL")
    connection = cx_Oracle.connect("ADMIN", "ADMIN123456", dsn, encoding="UTF-8")
    cur = connection.cursor()
    

    #result = cur.callfunc('FETCH_QUESTION', periodID)
    #print(result)
    #return True

    query = "SELECT Q.* FROM QUESTION Q WHERE Q.TOPIC = '" + topic + "'"
    cur.execute(query)

    results = []
    cur.rowfactory = dictFact(cur)

    for result in cur.fetchall():
        results.append(result)
        
    
    results = results[random.randint(0,len(results) -1 )]
    connection.close()
    jsonResults = json.dumps(results)
    print(jsonResults)
    return jsonResults

# lambda_handler(json.loads("""
# {
#  "periodID": 1,
#  "topic": "Art",
#  "userName": "ROY",
#  "response": {}
# }"""), None)