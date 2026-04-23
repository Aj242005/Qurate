import psycopg
from models import falseRes, trueRes
import typing
import re


def _safe_db_name(raw: str) -> str:
    """Convert an email/string to a safe lowercase postgres identifier."""
    name = re.sub(r"[^a-z0-9]", "_", raw.lower())
    return ("u_" + name)[:63]


class Postgres:
    def __init__(self, password="postgres", dbname="postgres", host="localhost", user="postgres"):
        self.basic_config = {
            "host": host,
            "user": user,
            "password": password,
            "dbname": dbname,
            "autocommit": True,
            "port" : 5432
        }
        self.connection = psycopg.connect(**self.basic_config)
        self.cursor = self.connection.cursor()

    def executeQuery(self, query: str) -> trueRes.SuccessRes | falseRes.ErrRes:
        try:
            self.cursor.execute(typing.cast(typing.LiteralString, query))
            response = self.cursor.fetchall()
            return trueRes.SuccessRes(
                status=200,
                message="Successfully executed the query",
                anotherValid=response
            )
        except Exception as e:
            return falseRes.ErrRes(
                status=520,
                message=f"Error Executing the query : {query}",
                anotherValid=e
            )

    def createUserDatabase(self, email: str) -> trueRes.SuccessRes | falseRes.ErrRes:
        """
        Creates a new Postgres database named after the user's email (sanitised).
        Must be called on a connection to the default 'postgres' DB with autocommit=True.
        Idempotent — skips creation if the DB already exists.
        """
        db_name = _safe_db_name(email)
        try:
            # Check existence first
            self.cursor.execute(
                "SELECT 1 FROM pg_database WHERE datname = %s", (db_name,)
            )
            exists = self.cursor.fetchone()
            if not exists:
                self.cursor.execute(
                    typing.cast(typing.LiteralString, f'CREATE DATABASE "{db_name}"')
                )
            return trueRes.SuccessRes(
                status=201,
                message=f"Sandbox database '{db_name}' is ready",
                anotherValid={"db_name": db_name}
            )
        except Exception as e:
            return falseRes.ErrRes(
                status=521,
                message=f"Failed to create sandbox database for {email}",
                anotherValid=str(e)
            )

    def close(self):
        self.cursor.close()
        self.connection.close()