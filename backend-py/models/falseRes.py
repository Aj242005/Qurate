from pydantic import BaseModel,Field
from typing import Annotated

class ErrRes(BaseModel):
    status =  Annotated(int ,Field(default=200,description="This is the HTTP status code. This is used to provide an early categorization of response"))
    message = Annotated(str, Field(description="This is the description of the error which have occured"))
    anotherValid = Annotated(object | None, Field(description="Any other valid supporting object"))