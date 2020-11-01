/*
Modification_date: 2020/10/31
Creator: Alberto Pascal
Last modified by: Alberto Pascal
Description: Queries to fetch rankings by topic and by period_id

*/

/* Need to replace the where condition with the corresponding username to look for. */


/* RANKING BY PERIOD */
WITH PERIOD_RANKING_UNIVERSE AS (
    SELECT 
        ROW_NUMBER() OVER (
            PARTITION BY GP.PERIOD_ID
            order by SCORE DESC
        ) AS RANKING,
        GP.PERIOD_ID,
        P.TOPIC,
        GP.PLAYER_NAME,
        GP.SCORE 
    FROM GAME_IS_PLAYED GP JOIN GAME_PERIOD P ON GP.PERIOD_ID = P.PERIOD_ID
)
SELECT 
    RANKING, 
    PLAYER_NAME, 
    SCORE
FROM PERIOD_RANKING_universe
WHERE
    period_id = 1;

/* RANKING BY topic */
WITH PERIOD_RANKING_UNIVERSE AS (
    SELECT 
        ROW_NUMBER() OVER (
            PARTITION BY P.TOPIC
            order by SCORE desc , P.period_id asc
        ) AS RANKING,
        GP.PERIOD_ID,
        P.TOPIC,
        GP.PLAYER_NAME,
        GP.SCORE 
    FROM GAME_IS_PLAYED GP JOIN GAME_PERIOD P ON GP.PERIOD_ID = P.PERIOD_ID
)
SELECT 
    RANKING, 
    PLAYER_NAME, 
    SCORE
FROM PERIOD_RANKING_universe
WHERE Topic = 'History';