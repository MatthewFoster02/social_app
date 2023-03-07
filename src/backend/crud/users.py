from fastapi import Body, Request

from models.users import UserBase

def createUser(request:Request, newUser:UserBase=Body(...)):
    pass