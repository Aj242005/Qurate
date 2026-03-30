from pydantic import BaseModel, EmailStr, Field
from typing import Annotated

class Payload(BaseModel):
    name: Annotated[str, Field(description="Name of the user", max_length=50, min_length=1)]
    email: Annotated[EmailStr, Field(description="email id of the user")]
    user_id: Annotated[str, Field(description="unique user id")]