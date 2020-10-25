from __future__ import print_function
import cx_Oracle
import boto3
import json

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
    
    str_test = "INSERT INTO PLAYER (USERNAME) VALUES ('" + event['userName'] + "')"
    cur.execute(str_test)
    cur.execute("COMMIT")
    str_test = "SELECT * FROM PLAYER WHERE USERNAME = '" + event['userName'] + "'"
    cur.execute(str_test)
    player = []
    for result in cur.fetchall():
        player.append(result)
    connection.close()
    return event