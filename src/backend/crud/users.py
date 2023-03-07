from fastapi import Body, Request

from models.users import UserBase

async def createUser(request:Request, newUser:UserBase=Body(...)):
    user = await request.app.mongodb['users'].insert_one(newUser)
    return await request.app.mongodb['users'].find_one({'_id': user.inserted_id})

async def getUser(request:Request, userID:int):
    user = request.app.mongodb['users'].find_one({'_id': userID})
    return UserBase(**user) if user is not None else None

async def updateUser(request:Request, updateUser:UserBase):
    pass
