from fastapi import Request

from models.users import UserBase, UserUpdate

async def createUser(request:Request, newUser:UserBase):
    user = await request.app.mongodb['users'].insert_one(newUser)
    return await request.app.mongodb['users'].find_one({'_id': user.inserted_id})

async def getUser(request:Request, userID:int):
    user = await request.app.mongodb['users'].find_one({'_id': userID})
    return UserBase(**user) if user is not None else None

async def updateUser(request:Request, userID:int, updateUser:UserUpdate):
    await request.app.mongodb['users'].update_one(
        {'_id': userID}, {'$set': updateUser.dict(exclude_unset=True)}
    )

    user = await request.app.mongodb['users'].find_one({'_id': userID})
    return UserBase(**user) if user is not None else None

async def deleteUser(request:Request, userID:int):
    deleted = await request.app.mongodb['users'].delete_one({'_id': userID})
    return deleted.deleted_count == 1
