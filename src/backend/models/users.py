from typing import Optional
from email_validator import validate_email, EmailNotValidError
from pydantic import BaseModel, EmailStr, Field, validator

from models.base import MongoBaseModel

class UserBase(MongoBaseModel):
    firstname:str = Field(..., max_length=20)
    lastname:str = Field(..., max_length=20)
    username:str = Field(..., max_length=16)
    email:str = Field(...)
    password:str = Field(..., min_length=8, max_length=16)
    profile_pic:Optional[str] = None
    bio:str = Field(..., max_length=200)
    birthday:Optional[int] = None

    @validator('email')
    def valid_email(cls, v):
        try:
            email = validate_email(v).email
            return email
        except EmailNotValidError:
            raise EmailNotValidError

class LoginBase(BaseModel):
    email:str = EmailStr(...)
    password:str = Field(...)
