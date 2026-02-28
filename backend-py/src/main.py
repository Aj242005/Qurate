from fastapi import FastAPI
from dotenv import load_dotenv
import os
from models import falseRes,userModel,trueRes
load_dotenv()


mongo_uri = os.getenv("MONGO_URI")
gemini_api = os.getenv("GEMINI_API_KEY")
server = FastAPI()

@server.post("/sign-up")
async def signUp(user : userModel.UserRes) -> falseRes.ErrRes | trueRes.SuccessRes :
    
