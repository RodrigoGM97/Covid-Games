import cx_Oracle
import boto3
import json

def lambda_handler(event, context):
    print("cx_oracle")
    dsn = cx_Oracle.makedsn("allmightydb.c3kp0won1ead.us-east-1.rds.amazonaws.com", 1521, service_name="ORCL")
    connection = cx_Oracle.connect("ADMIN", "ADMIN123456", dsn, encoding="UTF-8")
    cur = connection.cursor()
    cur.execute("""
        SELECT * FROM PLAYER
        """)

    users = []
    for result in cur.fetchall():
        users.append(result)
        print(result)
    connection.close()
    return str(users)