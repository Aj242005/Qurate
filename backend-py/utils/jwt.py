from jose import jwt
from models import userModel,payload
import datetime
from datetime import timedelta,timezone
class JWToken:
    def __init__(self, secret : str, duration : int, typeof : str):
        self._token_secret = secret
        self._valid_duration = duration
        self._type = typeof
    
    def createAccessToken(self, userPayload : payload.Payload) -> str :
        currTime = datetime.datetime.now()
        exp = None
        if(self._type == "refresh"):
            exp = currTime + timedelta(days=int(self._valid_duration))
        else:
            exp = currTime + timedelta(minutes=int(self._valid_duration))
        userPayload["exp"] = exp
        userPayload["iat"] = datetime.datetime.now(tz=timezone.utc)
        return jwt.encode(claims=userPayload, key=self._token_secret, algorithm="HS256" )
    
    def verifyAccessToken(self, jwtoken : str ) -> bool :
        return jwt.decode( token = jwtoken,key=self._token_secret,algorithms=["HS256"])     