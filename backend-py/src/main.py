from fastapi import FastAPI
from dotenv import load_dotenv
import os
from models import falseRes, userModel, trueRes
from utils import generateuuid,password
from db import mongo


load_dotenv()

mongo_uri = os.getenv("MONGO_URI")
gemini_api = os.getenv("GEMINI_API_KEY")
server = FastAPI()

mongo_db = mongo.MongoDB(mongo_uri)


@server.get("/")
def homeRoute():
    return {
        "status": 200,
        "message": "Welcome to Qurate Backend"
    }
# 
@server.post( "/sign-up", response_model = falseRes.ErrRes | trueRes.SuccessRes )
async def signUp(user: userModel.UserRes):
    uuid = generateuuid.generateUUID()
    user = user.model_dump()
    userPass = password.Password(str(user["password"]))
    userPass.generate_salt()
    user["password"] = userPass.hashPassword()
    user = userModel.User(user_id=uuid,**user)
    if( mongo_db.retreieveUserInfo(email = user.email)["anotherValid"] != None or mongo_db.retreieveUserInfo(phone_number = user.phone_number)["anotherValid"] != None ):
        return {
            "status" : 409,
            "message":"User with same email or number exists",
            "anotherValid" : {
                                user.email,
                                user.phone_number
                            }
        }
    else:
        response = mongo_db.addUserInfoToDB(user)
        return response