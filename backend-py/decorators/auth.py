from fastapi import Request, HTTPException
from utils.jwt import JWToken
import functools
import inspect
from models import falseRes

def authentication_decorator(accessToken : JWToken):
    def decorator(childFunc):
        # Build a new signature that hides 'verifiedObj' from FastAPI
        orig_sig = inspect.signature(childFunc)
        filtered_params = [
            p for name, p in orig_sig.parameters.items()
            if name != "verifiedObj"
        ]
        new_sig = orig_sig.replace(parameters=filtered_params)

        @functools.wraps(childFunc)
        async def wrapper( request : Request, *args, **kwargs):
            token = request.headers.get("accesstoken")
            if( token is not None):
                tokenStatus = accessToken.verifyToken(token)
                if(tokenStatus.status == 200):
                    #hence the status of the token is verified
                    return await childFunc(request=request, *args, **kwargs, verifiedObj = tokenStatus.anotherValid)
                else:
                    if(tokenStatus.status == 565):
                        raise HTTPException(
                            status_code=410,
                            detail="Your access token was authentic but expired translate to /refresh route to ask for a new one with your unexpired refresh token"
                        )
                    elif(tokenStatus.status == 566):
                        raise HTTPException(
                            status_code=401,
                            detail="The access token have been tampered and redirect it to the /login route cause the tampering may lead to data leak and also invalidate the previously create refresh token"
                        )
            else:
                raise HTTPException(
                    status_code=401,
                    detail="No access token found kindly redirect to /login"
                )

        # Override the signature so FastAPI doesn't try to resolve 'verifiedObj'
        wrapper.__signature__ = new_sig
        return wrapper
    return decorator