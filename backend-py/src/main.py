from fastapi import FastAPI, Response, Request, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from models import falseRes, userModel, trueRes, payload, promptModel
from utils import generateuuid, password
from db import mongo
from utils.jwt import JWToken
from redisdb.redis_main import RedisBasic
from postgresdb.main_postgres import Postgres, _safe_db_name
from agents.agent import Agent
from decorators.auth import authentication_decorator
from pydantic import SecretStr

load_dotenv()

mongo_uri        = str(os.getenv("MONGO_URI"))
gemini_api       = str(os.getenv("GEMINI_API_KEY"))
access_secret    = str(os.getenv("ACCESS_TOKEN_SECRET_KEY"))
access_duration  = int(os.getenv("ACCESS_TOKEN_DURATION", "60"))
refresh_secret   = str(os.getenv("REFRESH_TOKEN_SECRET_KEY"))
refresh_duration = int(os.getenv("REFRESH_TOKEN_DURATION", "30"))
postgres_pass    = str(os.getenv("POSTGRES_PASSWORD"))
postgres_host    = str(os.getenv("POSTGRES_HOST", "localhost"))
postgres_user    = str(os.getenv("POSTGRES_USER", "defaultUser@Qurate"))

server = FastAPI()

server.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["accesstoken", "refreshtoken"], 
)

mongo_db      = mongo.MongoDB(mongo_uri)
access_token  = JWToken(secret=access_secret,  duration=access_duration,  typeof="access")
refresh_token = JWToken(secret=refresh_secret, duration=refresh_duration, typeof="refresh")
redis_client  = RedisBasic()
llm_agent     = Agent(api_key=SecretStr(gemini_api))

admin_postgres = Postgres(
    password=postgres_pass,
    dbname="postgres",
    host=postgres_host,
    user=postgres_user,
)


def _open_user_db(email: str) -> Postgres:
    return Postgres(
        password=postgres_pass,
        dbname=_safe_db_name(email),
        host=postgres_host,
        user=postgres_user,
    )


@server.get("/")
def homeRoute():
    return {"status": 200, "message": "Welcome to Qurate Backend"}


@server.get("/about")
def about():
    return {
        "status": 200,
        "message": (
            "this is our smart database service where you can do everything "
            "without needing to actually interact with the database directly, "
            "just tell it what and how you want to get the work done"
        )
    }


@server.post("/sign-up", response_model=falseRes.ErrRes | trueRes.SuccessRes)
def signUp(user: userModel.UserRes):
    uuid        = generateuuid.generateUUID()
    user_model  = user.model_dump()
    userPass    = password.Password(str(user_model["password"]))
    userPass.generate_salt()
    user_model["password"] = userPass.hashPassword()
    user_model  = userModel.User(user_id=uuid, **user_model)

    email_check = mongo_db.retreieveUserInfo(email=user.email)
    phone_check = mongo_db.retreieveUserInfo(phone_number=user.phone_number)

    if (
        (email_check and email_check.get("anotherValid") is not None) or
        (phone_check and phone_check.get("anotherValid") is not None)
    ):
        return falseRes.ErrRes(
            status=409,
            message="User with same email or phone number exists",
            anotherValid={"email": user.email, "phone_number": user.phone_number}
        )

    response = mongo_db.addUserInfoToDB(user_model)

    db_provision = admin_postgres.createUserDatabase(user.email)
    if db_provision.status != 201:
        print(f"[WARN] Could not create sandbox DB for {user.email}: {db_provision.message}")

    return response


@server.post("/login", response_model=falseRes.ErrRes | trueRes.SuccessRes)
def login(user: userModel.loginReq, response: Response, request: Request):
    db_user_res = mongo_db.retreieveUserInfo(email=user.email)
    if not db_user_res or db_user_res.get("status") != 200 or db_user_res.get("anotherValid") is None:
        return falseRes.ErrRes(status=401, message="user not found or database error", anotherValid=None)

    db_user      = db_user_res["anotherValid"]
    password_byte = user.password.encode()
    is_valid     = password.Password.verifyPassword(password_byte, db_user["password"].encode("utf-8"))

    if not is_valid:
        return falseRes.ErrRes(status=401, message="invalid password", anotherValid=None)

    payloadd = {"email": db_user["email"], "user_id": db_user["user_id"], "name": db_user["name"]}
    payload_instance = payload.Payload.model_validate(payloadd)

    response.headers["accesstoken"]  = str(access_token.createToken(payload_instance).anotherValid)
    rfToken                           = str(refresh_token.createToken(payload_instance).anotherValid)

    if request.headers.get("refreshtoken") is not None:
        redis_client.invalidateRefreshToken(
            refreshToken=str(request.headers.get("refreshtoken")), email=db_user["email"]
        )

    response.headers["refreshtoken"] = rfToken
    redis_client.addRefreshTokenToRedis(rfToken, db_user["email"])

    return trueRes.SuccessRes(status=200, message="logged in succesfully", anotherValid=None)


@server.post("/refresh")
def refreshTokenGeneration(response: Response, request: Request) -> falseRes.ErrRes | trueRes.SuccessRes:
    rfToken = request.headers.get("refreshtoken")
    if rfToken is not None:
        verificationStatus = refresh_token.verifyToken(rfToken)
        if verificationStatus.status == 200:
            if verificationStatus.anotherValid is None:
                return falseRes.ErrRes(status=401, message="Invalid token payload", anotherValid=None)

            userEmail           = str(verificationStatus.anotherValid.get("email"))
            refreshTokenStatus  = redis_client.checkRefreshTokenStatus(refreshToken=rfToken, email=userEmail)

            if refreshTokenStatus.anotherValid:
                redis_client.invalidateRefreshToken(rfToken, userEmail)
                payload_instance = payload.Payload.model_validate(verificationStatus.anotherValid)
                newRf            = refresh_token.createToken(payload_instance).anotherValid
                redis_client.addRefreshTokenToRedis(str(newRf), userEmail)
                response.headers["accesstoken"]  = str(access_token.createToken(payload_instance).anotherValid)
                response.headers["refreshtoken"] = str(newRf)
                return trueRes.SuccessRes(status=200, message="Valid refresh token used", anotherValid=None)
            else:
                return falseRes.ErrRes(status=401, message="Invalid Refresh token used", anotherValid=None)
        else:
            return falseRes.ErrRes(
                status=401,
                message="Tampered or expired refresh token is provided by the client",
                anotherValid=verificationStatus.anotherValid
            )
    else:
        return falseRes.ErrRes(status=404, message="Refresh Token not found in the headers", anotherValid=None)


async def _prompt2query_handler( body: promptModel.PromptRequest, request: Request, verifiedObj: dict) -> dict | falseRes.ErrRes :
    """
    Core handler (decorated separately so the decorator wraps cleanly).
    Pipeline:
      1. Resolve user identity from verified JWT payload.
      2. Load chat history from Mongo.
      3. Open user's sandboxed Postgres DB.
      4. Run agent (SQL gen → security audit → execute → format).
      5. Persist both sides of the conversation to Mongo.
      6. Return typed response.
    """
    email   = str(verifiedObj.get("email"))
    user_id = str(verifiedObj.get("user_id"))

    history_res = mongo_db.getChatHistory(user_id=user_id, limit=20)
    chat_history: list[dict] = history_res.get("anotherValid") or []

    try:
        user_db = _open_user_db(email)
    except Exception as e:
        return falseRes.ErrRes(
            status=500,
            message=f"Could not connect to your sandbox database: {str(e)}",
            anotherValid={"type": "text", "response": "Database connection failed. Please contact support."}
        )

    try:
        db_name    = _safe_db_name(email)
        agent_res  = llm_agent.execute_agent_query(
            user_prompt=body.prompt,
            postgres_client=user_db,
            user_dbname=db_name,
            chat_history=chat_history,
        )
    except Exception as e:
        user_db.close()
        error_msg = f"Agent error: {str(e)}"
        mongo_db.appendChatMessage(
            user_id=user_id,
            role="user",
            content=body.prompt,
            response_obj={"type": "text", "response": body.prompt}
        )
        mongo_db.appendChatMessage(
            user_id=user_id,
            role="assistant",
            content=error_msg,
            response_obj={"type": "text", "response": error_msg}
        )
        return {
            "status": 500,
            "message": error_msg,
            "data": {"type": "text", "response": error_msg}
        }

    user_db.close()

    typed_response = agent_res.anotherValid if agent_res.anotherValid else {"type": "text", "response": agent_res.message}

    mongo_db.appendChatMessage(
        user_id=user_id,
        role="user",
        content=body.prompt,
        response_obj={"type": "text", "response": body.prompt}
    )
    mongo_db.appendChatMessage(
        user_id=user_id,
        role="assistant",
        content=typed_response.get("response", "") if isinstance(typed_response.get("response"), str) else str(typed_response.get("response", "")),
        response_obj=typed_response
    )

    if agent_res.status != 200:
        return {
            "status": agent_res.status,
            "message": agent_res.message,
            "data": typed_response
        }

    return {
        "status": 200,
        "message": "Query processed",
        "data": typed_response
    }


@server.post(
    "/prompt2query",
    response_model=None,
    summary="Natural language → SQL → typed response"
)
@authentication_decorator(access_token)
async def prompt2query(body: promptModel.PromptRequest, request: Request, verifiedObj: dict):
    """
    Authenticated route. Requires 'accesstoken' header.
    Returns one of: {"type":"text",...} | {"type":"table",...} | {"type":"graph",...}
    """
    return await _prompt2query_handler(body=body, request=request, verifiedObj=verifiedObj)


@server.get("/chat-history")
@authentication_decorator(access_token)
async def getChatHistory(request: Request, verifiedObj: dict):
    """Returns the authenticated user's full chat history."""
    user_id = str(verifiedObj.get("user_id"))
    res     = mongo_db.getChatHistory(user_id=user_id, limit=50)
    return res


@server.delete("/chat-history")
@authentication_decorator(access_token)
async def clearChatHistory(request: Request, verifiedObj: dict):
    """Clears the authenticated user's chat history."""
    user_id = str(verifiedObj.get("user_id"))
    res     = mongo_db.clearChatHistory(user_id=user_id)
    return res


@server.get("/random-unit-testing-route")
def unit_testing():
    return {"message": "random something very bad"}


@server.post("/upload-excel")
@authentication_decorator(access_token)
async def upload_excel(request: Request, verifiedObj: dict, file: UploadFile = File(...)):
    """
    Authenticated route. Accepts an Excel/CSV file, parses it with pandas,
    and creates a new table in the user's sandboxed Postgres database.
    """
    import pandas as pd
    import io
    import re as _re

    email = str(verifiedObj.get("email"))

    filename = file.filename or "upload.xlsx"
    if not filename.endswith((".xlsx", ".xls", ".csv")):
        return falseRes.ErrRes(
            status=400,
            message="Only .xlsx, .xls, and .csv files are supported",
            anotherValid=None
        )

    contents = await file.read()

    try:
        if filename.endswith(".csv"):
            df = pd.read_csv(io.BytesIO(contents))
        else:
            df = pd.read_excel(io.BytesIO(contents))
    except Exception as e:
        return falseRes.ErrRes(
            status=400,
            message=f"Could not parse file: {str(e)}",
            anotherValid=None
        )

    if df.empty:
        return falseRes.ErrRes(
            status=400,
            message="The uploaded file contains no data",
            anotherValid=None
        )

    raw_table = _re.sub(r"[^a-z0-9]", "_", filename.rsplit(".", 1)[0].lower())
    table_name = f"t_{raw_table}"[:63]

    def pg_type(dtype) -> str:
        s = str(dtype)
        if "int" in s:
            return "BIGINT"
        if "float" in s:
            return "DOUBLE PRECISION"
        if "bool" in s:
            return "BOOLEAN"
        if "datetime" in s:
            return "TIMESTAMP"
        return "TEXT"

    columns = []
    for col in df.columns:
        safe_col = _re.sub(r"[^a-z0-9_]", "_", str(col).lower().strip())
        if not safe_col or safe_col[0].isdigit():
            safe_col = "c_" + safe_col
        columns.append(safe_col)
    df.columns = columns  # type: ignore[assignment]

    col_defs = ", ".join(f'"{c}" {pg_type(df[c].dtype)}' for c in columns)
    create_sql = f'CREATE TABLE IF NOT EXISTS "{table_name}" ({col_defs});'

    try:
        user_db = _open_user_db(email)
    except Exception as e:
        return falseRes.ErrRes(
            status=500,
            message=f"Could not connect to sandbox database: {str(e)}",
            anotherValid=None
        )

    try:
        user_db.cursor.execute(create_sql)  # type: ignore[arg-type]

        if len(columns) > 0 and len(df) > 0:
            placeholders = ", ".join(["%s"] * len(columns))
            insert_sql = f'INSERT INTO "{table_name}" ({", ".join(f"{c}" for c in columns)}) VALUES ({placeholders})'
            for _, row in df.iterrows():
                values = [None if pd.isna(v) else v for v in row.tolist()]
                user_db.cursor.execute(insert_sql, values)  # type: ignore[arg-type]

        user_db.close()
    except Exception as e:
        user_db.close()
        return falseRes.ErrRes(
            status=520,
            message=f"Error creating table: {str(e)}",
            anotherValid=None
        )

    return trueRes.SuccessRes(
        status=201,
        message=f"Table '{table_name}' created with {len(df)} rows and {len(columns)} columns",
        anotherValid={"table_name": table_name, "rows": len(df), "columns": columns}
    )