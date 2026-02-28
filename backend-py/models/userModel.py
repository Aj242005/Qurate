from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Annotated
from datetime import date

class UserRes(BaseModel):
    name: Annotated[str, Field(description="Name of the user", max_length=50, min_length=1)]
    email: Annotated[EmailStr, Field(description="email id of the user")]
    purpose: Annotated[str | None, Field(default=None, description="purpose of using this application")]
    gender: Annotated[str, Field(description="Gender of the user")]
    password: Annotated[bytes, Field(description="Encrypted password of the user")]
    phone_number: Annotated[str, Field(description="Phone number of the user")]

    @field_validator("gender")
    @classmethod
    def _check_for_gender(cls, value: str) -> str:
        if value.lower() not in ["male", "female", "others", "do not specify"]:
            raise ValueError("Not a valid Gender")
        return value.lower()

class User(UserRes):
    user_id: Annotated[str, Field(description="unique user id")]
    user_type: Annotated[str, Field(default="freemium", description="Either premium, freemium user or enterprise")]

    @field_validator("user_type")
    @classmethod
    def _check_type(cls, value: str) -> str:
        if value.lower() not in ["premium", "freemium", "enterprise"]:
            raise ValueError("Invalid user type")
        return value.lower()