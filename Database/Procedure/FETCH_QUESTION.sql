
CREATE OR REPLACE PROCEDURE FETCH_QUESTION
(
    V_PERIOD_ID IN NUMBER,
    V_QUESTION OUT VARCHAR2,
    V_ANSWER1 OUT VARCHAR2,
    V_ANSWER2 OUT VARCHAR2,
    V_ANSWER3 OUT VARCHAR2,
    V_ANSWER4 OUT VARCHAR2,
    V_CORRECT_ANSWER OUT NUMBER
)
IS 
V_MAX_QUESTIONS NUMBER;
V_RAND_OFFSET NUMBER;
V_QUESTION_ID NUMBER;
BEGIN
    DBMS_OUTPUT.ENABLE();
    SELECT COUNT(*) INTO V_MAX_QUESTIONS FROM QUESTION_IN_PERIOD WHERE PERIOD_ID = V_PERIOD_ID;
    SELECT ROUND(DBMS_RANDOM.VALUE(1,V_MAX_QUESTIONS),0) INTO V_RAND_OFFSET FROM DUAL;
    
    WITH NUMBERED_QUESTIONS AS (
    SELECT 
    QUESTION_ID,
    ROW_NUMBER() OVER (ORDER BY QUESTION_ID) AS RN
    FROM QUESTION_IN_PERIOD WHERE PERIOD_ID = 1  
    ORDER BY QUESTION_ID
    )
    SELECT QUESTION_ID INTO V_QUESTION_ID FROM NUMBERED_QUESTIONS WHERE RN = V_RAND_OFFSET ;
    DBMS_OUTPUT.PUT_LINE('FETCHED QUESTION_ID: '||V_QUESTION_ID);
    SELECT QUESTION, OPTION1, OPTION2, OPTION3, OPTION4, ANSWER INTO V_QUESTION, V_ANSWER1, V_ANSWER2, V_ANSWER3, V_ANSWER4, V_CORRECT_ANSWER FROM QUESTION WHERE QUESTION_ID = V_QUESTION_ID;
    DBMS_OUTPUT.PUT_LINE('DATA FETCH COMPLETE...');
        
END;
/

