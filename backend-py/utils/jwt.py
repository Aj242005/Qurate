from jose import jwt,exceptions
from models import userModel,payload,trueRes,falseRes
import datetime
from datetime import timedelta,timezone
class JWToken:
    def __init__(self, secret : str, duration : int, typeof : str):
        self._token_secret = secret
        self._valid_duration = duration
        self._type = typeof
    
    def createAccessToken(self, userPayload : payload.Payload) -> trueRes.SuccessRes | falseRes.ErrRes :
        try:
            currTime = datetime.datetime.now()
            exp = None
            if(self._type == "refresh"):
                exp = currTime + timedelta(days=int(self._valid_duration))
            else:
                exp = currTime + timedelta(minutes=int(self._valid_duration))
            user = userPayload.model_dump()
            user["exp"] = exp
            user["iat"] = datetime.datetime.now(tz=timezone.utc)
            return trueRes.SuccessRes(
                status = 201,
                message= "New access token generated for the user",
                anotherValid = jwt.encode(claims=user, key=self._token_secret, algorithm="HS256" )
            )
        except Exception as err:
            return falseRes.ErrRes( 
                status = 564,
                message= "Error encountered in generating new access token",
                anotherValid = err
             )

    def verifyAccessToken(self, jwtoken : str ) -> trueRes.SuccessRes | falseRes.ErrRes :
        try:
            return trueRes.SuccessRes(
                status = 200,
                message= "Successfully decoded the users access token",
                anotherValid = jwt.decode( token = jwtoken,key=self._token_secret,algorithms=["HS256"])
            )
        except exceptions.ExpiredSignatureError as err:
            return falseRes.ErrRes(
                status = 565,
                message = "The access token of user is expired -> check for refresh and create a new access token",
                anotherValid = err
            )
        except Exception as err:
            return falseRes.ErrRes(
                status = 566,
                message = "The access token provided by the user in invalid or tampered --> re-login",
                anotherValid = err
            )
