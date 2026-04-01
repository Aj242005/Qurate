from models.userModel import loginReq
from fastapi import Response
import numpy as np
def authentication_decorator( login : function ):
    def wrapper( response : Response, loginInfo : loginReq ):
        if(response.headers["token"]):


np.random.uniform(size=())