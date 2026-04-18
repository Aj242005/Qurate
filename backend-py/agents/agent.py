from langchain_google_genai import ChatGoogleGenerativeAI
from pydantic import SecretStr
from postgresdb.main_postgres import Postgres

class Agent:
    def __init__(self, api_key : SecretStr):
        self._api = api_key
        self.Agent = ChatGoogleGenerativeAI(model="gemini-3.1-pro-preview",api_key=self._api,kwargs={
            "temperature" : 0.7
        }) #might need to change this is future if we need more creativity in our llm
    def execute_agent_query(self, userPrompt : str, userid : str, postgresClient : Postgres):
