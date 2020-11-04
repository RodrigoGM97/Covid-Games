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

    
    dsn = cx_Oracle.makedsn("allmightydb.c3kp0won1ead.us-east-1.rds.amazonaws.com", 1521, service_name="ORCL")
    connection = cx_Oracle.connect("ADMIN", "ADMIN123456", dsn, encoding="UTF-8")
    cur = connection.cursor()

    query = "SELECT PERIOD_ID, PLAYER_NAME, SCORE FROM GAME_IS_PLAYED WHERE PERIOD_ID = " + str(event['seasonID']) + " AND PLAYER_NAME = '" + event['userName'] + "'"
    
    cur.execute(query)
    results = []
    cur.rowfactory = dictFact(cur)
    #print(cur.fetchone())


    for result in cur.fetchall():
        results.append(result)
        
    connection.close()
    jsonResults = json.dumps(results)
    print(jsonResults)
    return jsonResults

# lambda_handler(json.loads("""
# {
#  "seasonID": 1,
#  "userName": "ROY",
#  "response": {}
# }"""), None)