from typing import Optional
from email_validator import validate_email, EmailNotValidError
from pydantic import BaseModel, EmailStr, Field, validator

from models.base import MongoBaseModel

# Defines the structure of the user object 
class UserBase(MongoBaseModel):
    firstname:str = Field(..., max_length=20)
    lastname:str = Field(..., max_length=20)
    username:str = Field(..., max_length=16)
    email:str = Field(...)
    password:str = Field(...)
    profile_pic:Optional[str] = None
    bio:Optional[str] = None
    birthday:Optional[int] = None

    # Validate email entered
    @validator('email')
    def valid_email(cls, v):
        try:
            email = validate_email(v).email
            return email
        except EmailNotValidError:
            raise EmailNotValidError

# Allows for user information to be updated in the database
class UserUpdate(MongoBaseModel):
    firstname:Optional[str] = None
    lastname:Optional[str] = None
    username:Optional[str] = None
    password:Optional[str] = None
    profile_pic:Optional[str] = None
    bio:Optional[str] = None
    birthday:Optional[int] = None

# Defines login structure, only email and password needed for logging in
class LoginBase(BaseModel):
    email:str = EmailStr(...)
    password:str = Field(...)

class CurrentUser(BaseModel):
    email: str = EmailStr(...)
    username: str = Field(...)
    profile_pic: str = Field(...)
    bio: str = Field(...)
    birthday: int = Field(...)
