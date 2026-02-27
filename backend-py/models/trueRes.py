from pydantic import BaseModel,Field
from typing import Annotated

class SuccessRes(BaseModel):
    status =  Annotated(int ,Field(default=200,description="This is the HTTP status code. This is used to provide an early categorization of response"))
    message = Annotated(str, Field(description="This is the description which is a required thing for a successful response"))





def something(param)->SuccessRes | ErrRes :


    return {
        "status" : 200,
        "message" : "everything is working fine"
    }