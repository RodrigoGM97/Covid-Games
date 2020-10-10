# -*- coding: utf-8 -*-
"""
Created on Thu Oct  8 18:23:30 2020

@author: beto_
"""

#Import Libraries
import cx_Oracle
import pandas as pd
#Connect to Database
#connstr = cx_Oracle.connect("user/password@server/ServiceName")
connstr = "admin/password@connection:1521/orcl"
connection = cx_Oracle.connect(connstr)
cursor = connection.cursor()
#Execute Query
cursor.execute("select * from db")
result = cursor.fetchall()
#Fetch results
for row in result:
    print(result)
#Transform Query results into a Pandas Dataframe
df = pd.DataFrame(result)
df.columns=[row[0] for row in cursor.description]
#Commit Changes
connection.commit()
#Close Cursor and Connection
cursor.close()
connection.close()