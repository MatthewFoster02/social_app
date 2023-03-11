from fastapi import Request
from fastapi.encoders import jsonable_encoder

from models.users import UserBase, UserUpdate

async def createUser(request:Request, newUser:UserBase):
    newUser = jsonable_encoder(newUser) # Encode as JSON
    user = await request.app.mongodb['users'].insert_one(newUser)
    return await request.app.mongodb['users'].find_one({'_id': user.inserted_id})

# Versatile method, allows for retrieval of user using any field
async def getUser(request:Request, userID:str, idType:str, login:bool=False):
    user = await request.app.mongodb['users'].find_one({idType: userID})
    if login:
        return user
    
    return UserBase(**user) if user is not None else None

async def updateUser(request:Request, userID:str, updateUser:UserUpdate):
    await request.app.mongodb['users'].update_one(
        {'_id': userID}, {'$set': updateUser.dict(exclude_unset=True)}
    )

    user = await request.app.mongodb['users'].find_one({'_id': userID})
    return UserBase(**user) if user is not None else None

async def deleteUser(request:Request, userID:str):
    deleted = await request.app.mongodb['users'].delete_one({'_id': userID})
    return deleted.deleted_count == 1
