from fastapi import FastAPI, Response, Request
from dotenv import load_dotenv
import os
from models import falseRes, userModel, trueRes, payload
from utils import generateuuid,password
from db import mongo
from utils.jwt import JWToken
from redisdb.redis_main import RedisBasic
load_dotenv()

mongo_uri = str(os.getenv("MONGO_URI"))
gemini_api = str(os.getenv("GEMINI_API_KEY"))
access_secret = str(os.getenv("ACCESS_TOKEN_SECRET_KEY"))
access_duration = int(os.getenv("ACCESS_TOKEN_DURATION", "60"))
refresh_secret = str(os.getenv("REFRESH_TOKEN_SECRET_KEY"))
refresh_duration = int(os.getenv("REFRESH_TOKEN_DURATION", "30"))
server = FastAPI()

mongo_db = mongo.MongoDB(mongo_uri)
access_token = JWToken(secret=access_secret,duration=access_duration,typeof="access")
refresh_token = JWToken(secret=refresh_secret,duration=refresh_duration,typeof="refresh")
redis_client = RedisBasic()
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
def signUp(user: userModel.UserRes):
    uuid = generateuuid.generateUUID()
    user_model = user.model_dump()
    userPass = password.Password(str(user_model["password"]))
    userPass.generate_salt()
    user_model["password"] = userPass.hashPassword()
    user_model = userModel.User(user_id=uuid,**user_model)
    email_check = mongo_db.retreieveUserInfo(email=user.email)
    phone_check = mongo_db.retreieveUserInfo(phone_number=user.phone_number)
    if (email_check and email_check.get("anotherValid") is not None) or (phone_check and phone_check.get("anotherValid") is not None):
        return falseRes.ErrRes(
            status = 409,
            message= "User with same email or phone number exists",
            anotherValid=  {
                                "email" : user.email,
                                "phone_number" :user.phone_number
                            }
        )
    else:
        response = mongo_db.addUserInfoToDB(user_model)
        return response
    
    
    
        
@server.post('/login', response_model= falseRes.ErrRes | trueRes.SuccessRes)
def login(user: userModel.loginReq, response : Response, request : Request):
    db_user_res = mongo_db.retreieveUserInfo(email=user.email)
    if not db_user_res or db_user_res.get("status") != 200 or db_user_res.get("anotherValid") is None:
        return falseRes.ErrRes(
            status = 401,
            message = "user not found or database error",
            anotherValid = None
        )
    db_user = db_user_res["anotherValid"]
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
        payloadd = {
            "email" : email ,
            "user_id": user_id,
            "name": name
        }
        payload_instance = payload.Payload.model_validate(payloadd)
        response.headers["accesstoken"] = str(access_token.createToken(payload_instance).anotherValid)
        rfToken = str(refresh_token.createToken(payload_instance).anotherValid)
        if ( request.headers.get("refreshtoken") is not None ):
            redis_client.invalidateRefreshToken(refreshToken=str(request.headers.get("refreshtoken")),email=email)
        response.headers["refreshtoken"] = rfToken
        redis_client.addRefreshTokenToRedis(rfToken,email)
        return trueRes.SuccessRes(
            status=200,
            message="logged in succesfully",
            anotherValid = None
        )


@server.post('/refresh')
def refreshTokenGeneration( response : Response , request : Request )-> falseRes.ErrRes | trueRes.SuccessRes:
    rfToken = request.headers.get("refreshtoken")
    if(rfToken is not None):
        verificationStatus = refresh_token.verifyToken(rfToken)
        if(verificationStatus.status == 200):
            if verificationStatus.anotherValid is None:
                return falseRes.ErrRes(
                    status = 401,
                    message = "Invalid token payload",
                    anotherValid = None
                )
            userEmail = str(verificationStatus.anotherValid.get('email'))
            refreshTokenStatus = redis_client.checkRefreshTokenStatus(refreshToken=rfToken,email=userEmail)
            if(refreshTokenStatus.anotherValid):
                redis_client.invalidateRefreshToken(rfToken,userEmail)
                payloadd = verificationStatus.anotherValid
                payload_instance = payload.Payload.model_validate(payloadd)
                newRf = refresh_token.createToken(payload_instance).anotherValid
                response.headers["accesstoken"] = str(access_token.createToken(payload_instance).anotherValid)
                response.headers["refreshtoken"] = str(newRf)
                redis_client.addRefreshTokenToRedis(str(newRf),userEmail)
                return trueRes.SuccessRes(
                    status = 200,
                    message = "Valid refresh token used",
                    anotherValid = None
                )
            else:
                return falseRes.ErrRes(
                    status = 401,
                    message = "Invalid Refresh token used",
                    anotherValid = None
                )
        else:
            return falseRes.ErrRes(
                status = 401,
                message = "Tampered or expired refresh token is provided by the client",
                anotherValid = verificationStatus.anotherValid
            )
    else:
        return falseRes.ErrRes(
            status = 404,
            message = "Refresh Token not found in the headers",
            anotherValid = None
        )


@server.get('/random-unit-testing-route')
def unit_testing():
    return {
        "message" : 'random something very bad'
    }