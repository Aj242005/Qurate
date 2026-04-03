import psycopg
from models import falseRes,trueRes
import typing

class Postgres:
    def __init__ ( self, password, dbname = "postgres", host= "localhost", user = "defaultUser@Qurate", autocommit = True ):
        self.basic_config = {
            "host" : host,
            "user" : user,
            "password" : password,
            "dbname" : dbname,
            "autocommit" : True
        }
        self.connection = psycopg.connect(**self.basic_config)
        self.cursor = self.connection.cursor()
    
    def executeQuery( self , query : str)-> trueRes.SuccessRes | falseRes.ErrRes:
        try:
            self.cursor.execute(typing.cast(typing.LiteralString,query))
            response = self.cursor.fetchall()
            return trueRes.SuccessRes(
                status = 200,
                message = "Successfully executed the query",
                anotherValid = response
            )
        except Exception as e:
            return falseRes.ErrRes(
                status = 520,
                message= f"Error Executing the query : {query}",
                anotherValid = e
            )
    def close(self):
        self.cursor.close()
        self.connection.close()
        