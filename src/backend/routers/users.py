from fastapi import APIRouter, Body, Depends, HTTPException, Request, Response, status
from fastapi.responses import JSONResponse
from decouple import config

from crud import users
from models.users import LoginBase, UserBase, UserUpdate
from authentication import Authorization

DEFAULT_PROFILE_PIC_URL = config('DEFAULT_PROFILE_PICTURE', cast=str)

router = APIRouter()
authorization = Authorization()

@router.post('/register', response_description='Register new user')
async def register(request:Request, newUser:UserBase=Body(...)):
    if newUser.profile_pic is None:
        newUser.profile_pic = DEFAULT_PROFILE_PIC_URL
    newUser.password = authorization.hashPassword(newUser.password)

    if await users.getUser(request, newUser.email, 'email') is not None:
        raise HTTPException(status_code=409, detail=f"User with email {newUser.email} already exists")

    user = await users.createUser(request, newUser)
    return JSONResponse(status_code=status.HTTP_201_CREATED, content=user)

@router.post('/login', response_description='Login user')
async def login(request:Request, loginUser:LoginBase=Body(...)):
    user = await users.getUser(request, loginUser.email, 'email', True)

    if user is None:
        raise HTTPException(status_code=401, detail='No account with entered email')
    
    if not authorization.verifyPassword(loginUser.password, user['password']):
        raise HTTPException(status_code=401, detail='Incorrect password')
    
    token = authorization.encodeToken(user['_id'])
    return JSONResponse(content={'user': user, 'token': token})

@router.get('/{id}', response_description='Get user by ID')
async def user_by_id(request:Request, id:str):
    user = await users.getUser(request, id, '_id')

    if user is not None:
        return user
    
    raise HTTPException(status_code=404, detail=f'User with id: {id} not found')

@router.patch('/{id}', response_description='Update user with ID')
async def update_user(request:Request, id:str, user:UserUpdate=Body(...), userID=Depends(authorization.authWrapper)):
    print(id, userID)
    if not id == userID:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Only user can update their profile')
    
    updated_user = await users.updateUser(request, userID, user)

    if updated_user is not None:
        return updated_user
    
    raise HTTPException(status_code=404, detail=f'User with id: {id} not found')

@router.delete('/{id}', response_description='Delete user with ID')
async def delete_user(request:Request, id:str, userID=Depends(authorization.authWrapper)):
    if id == userID:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Only user can update their profile')
    
    delete_success = await users.deleteUser(request, userID)

    if delete_success:
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    
    raise HTTPException(status_code=404, detail=f'User with id: {id} not found')
