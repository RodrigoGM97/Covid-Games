from __future__ import print_function
import cx_Oracle
import boto3
import json
import unidecode

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
    
    query = """
    DECLARE
    V_Q VARCHAR2(100);
    V_OP1 VARCHAR2(100);
    V_OP2 VARCHAR2(100);
    V_OP3 VARCHAR2(100);
    V_OP4 VARCHAR2(100);
    V_ANSWER NUMBER;

    BEGIN
    FETCH_QUESTION(1, V_Q, V_OP1, V_OP2, V_OP3, V_OP4, V_ANSWER);
    :QUESTION :=V_Q;
    :OP1 :=V_OP1;
    :OP2 :=V_OP2;
    :OP3 := V_OP3;
    :OP4 := V_OP4;
    :ANSWER :=V_ANSWER;
    END;
    """

    
    question = cur.var(cx_Oracle.STRING)
    op1 = cur.var(cx_Oracle.STRING)
    op2 = cur.var(cx_Oracle.STRING)
    op3 = cur.var(cx_Oracle.STRING)
    op4 = cur.var(cx_Oracle.STRING)
    answer = cur.var(cx_Oracle.NUMBER)

    cur.execute(query, {'QUESTION':question, 'OP1':op1, 'OP2':op2, 'OP3':op3, 'OP4':op4, 'ANSWER':answer})
    #print(question.getvalue())
    
    j = {
        "QUESTION": unidecode.unidecode(question.getvalue()),
        "OPTION1": unidecode.unidecode(op1.getvalue()),
        "OPTION2": unidecode.unidecode(op2.getvalue()),
        "OPTION3": unidecode.unidecode(op3.getvalue()),
        "OPTION4": unidecode.unidecode(op4.getvalue()),
        "ANSWER": answer.getvalue()
    }
    jsonResults = json.dumps(j)
    print(jsonResults)
    return jsonResults

# lambda_handler(json.loads("""
# {
#  "periodID": 1,
#  "topic": "Art",
#  "userName": "ROY",
#  "response": {}
# }"""), None)