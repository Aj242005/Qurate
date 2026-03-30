from fastapi import FastAPI
from dotenv import load_dotenv
import os
from models import falseRes, userModel, trueRes
from utils import generateuuid,password
from db import mongo
from utils.jwt import JWToken

load_dotenv()

mongo_uri = str(os.getenv("MONGO_URI"))
gemini_api = str(os.getenv("GEMINI_API_KEY"))
access_secret = str(os.getenv("ACCESS_TOKEN_SECRET_KEY"))
access_duration = int(os.getenv("ACCESS_TOKEN_DURATION"))
refresh_secret = str(os.getenv("REFRESH_TOKNE_SECRET_KEY"))
refresh_duration = int(os.getenv("REFRESH_TOKEN_DURATION"))
server = FastAPI()

mongo_db = mongo.MongoDB(mongo_uri)
access_token = JWToken(secret=access_secret,duration=access_duration)
refresh_token = JWToken(secret=refresh_secret,duration=refresh_secret)

@server.get("/")
def homeRoute():
    return {
        "status": 200,
        "message": "Welcome to Qurate Backend"
    }

@server.get('/about')
def about():
    return {"status":200,
            "message":"this is our smart database service where you can do everything without needing to actually interact with the database directly, just tell it what and how you want to get the work done"}

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
    
    
    
        
@server.post('/login', response_model= falseRes.ErrRes | trueRes.SuccessRes)
def login(user: userModel.loginReq):
    db_user = mongo_db.retreieveUserInfo(email=user.email)
    if db_user is None:
        return falseRes.ErrRes(
            status = 401,
            message = "user not found",
            anotherValid = None
        )
    db_user = db_user["anotherValid"]
    
    password_byte = user.password.encode()
    
    is_valid=password.Password.verifyPassword(password_byte,db_user["password"].encode('utf-8'))
    
    if not is_valid:
        return falseRes.ErrRes(
            status=401,
            message="invalid password",
            anotherValid = None
        )
    else:
        email = db_user["email"]
        user_id = db_user["user_id"]
        name = db_user["name"]
        payload = {
            "email" : email ,
            "user_id": user_id,
            "name": name
        }

        return trueRes.SuccessRes(
            status=200,
            message="logged in succesfully",
            anotherValid = None
        )
    
@server.get('/random-unit-testing-route')
def unit_testing():
    token = JWToken("12234234","20m")
    return token.createAccessToken(my={})