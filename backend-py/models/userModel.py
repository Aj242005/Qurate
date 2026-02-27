from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Annotated
import datetime

class DOB(BaseModel):
    date = Annotated(int,Field(description="date in dob",gt=0,lt=32))
    month = Annotated(int,Field(description="month in dob", gt = 0, lt=13))
    year = Annotated(int,Field(description="year of month", le =  datetime.date.year ))


class User(BaseModel):
    user_id = Annotated(str,Field(description="unique user id"))
    name = Annotated(str,Field(description="Name of the user with a max length of about 50 chars",max_length=50,min_length=1))
    email = Annotated(EmailStr,Field(description="email id of the user"))
    #purpose = Annotated(str | None, Field(default=None,description="purpose of using this application"))
    gender = Annotated(str, Field(description="Gender of the user"))
    dob = Annotated(DOB,Field(description="Date of birth of the user"))
    password = Annotated(bytes,Field(description="Encrypted password of the user"))
    user_type = Annotated(str,Field(default="freemium",description="Either premium , freemium user or enterprise"))
    phone_number = Annotated(str, Field(description="Phone number of the user"))


    @field_validator("user-type")
    @classmethod
    def checkType(cls,value):
        if(value not in ["premium","freemium","enterprise"]):
            raise Exception("Invalid user type")
        else:
            return value




    @field_validator("gender")
    @classmethod
    def checkForGender(cls,value):
        if(value not in ["male","female","others","do not specify"]):
            raise Exception("Not a valid Gender")
        else:
            return value
