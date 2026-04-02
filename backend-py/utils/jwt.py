from jose import jwt, exceptions
import datetime
from datetime import timedelta, timezone
from models import userModel, payload, trueRes, falseRes

class JWToken:
    def __init__(self, secret: str, duration: int, typeof: str):
        self._token_secret = secret
        self._valid_duration = duration
        self._type = typeof
    
    def createToken(self, userPayload: payload.Payload) -> trueRes.SuccessRes | falseRes.ErrRes:
        try:
            currTime = datetime.datetime.now(timezone.utc)
            
            if self._type == "refresh":
                exp = currTime + timedelta(days=int(self._valid_duration))
            else:
                exp = currTime + timedelta(minutes=int(self._valid_duration))
                
            user = userPayload.model_dump()
            user["exp"] = exp
            user["iat"] = currTime
            
            encoded_token = jwt.encode(claims=user, key=self._token_secret, algorithm="HS256")
            
            return trueRes.SuccessRes(
                status=201,
                message=f"New {self._type} token generated for the user",
                anotherValid=encoded_token
            )
        except Exception as err:
            return falseRes.ErrRes( 
                status=564,
                message=f"Error encountered in generating new {self._type} token",
                anotherValid=err
             )

    def verifyToken(self, jwtoken: str) -> trueRes.SuccessRes | falseRes.ErrRes:
        try:
            decoded_token = jwt.decode(token=jwtoken, key=self._token_secret, algorithms=["HS256"])
            return trueRes.SuccessRes(
                status=200,
                message=f"Successfully decoded the users {self._type} token",
                anotherValid=decoded_token
            )
        except exceptions.ExpiredSignatureError as err:
            return falseRes.ErrRes(
                status=565,
                message=f"The {self._type} token of user is expired",
                anotherValid=err
            )
        except Exception as err:
            return falseRes.ErrRes(
                status=566,
                message=f"The {self._type} token provided by the user is invalid or tampered",
                anotherValid=err
            )