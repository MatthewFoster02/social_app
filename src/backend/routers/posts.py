from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from datetime import datetime

from crud import posts
from authentication import Authorization

router = APIRouter()
authorization = Authorization()

@router.post('/create', response_description='Create new post')
async def create(request:Request, content:str, userID=Depends(authorization.authWrapper)):
    post = {
        'author': userID,
        'content': content,
        'date_posted': datetime.utcnow(),
        'likes': 0
    }

    post = jsonable_encoder(post)
    created_post = await posts.createPost(request, post)
    return JSONResponse(status_code=status.HTTP_201_CREATED, content=created_post)

@router.get('/all', response_description='Get all posts matching query')
async def get_all(request:Request, userID:Optional[str]=None, page:int=1):
    return await posts.getAllPosts(request, userID, page)

@router.get('/{id}', response_description='Get post with ID')
async def post_by_id(request:Request, id:str):
    post = await posts.getPostByID(request, id)

    if post is not None:
        return post
    
    raise HTTPException(status_code=404, detail=f'Post with id: {id} not found')

@router.delete('/{id}', response_description='Delete post with ID')
async def delete_post(request:Request, id:str, userID=Depends(authorization.authWrapper)):
    post_to_delete = await posts.getPostByID(request, id)

    if post_to_delete is None:
        raise HTTPException(status_code=404, detail=f'Post with id: {id} not found')
    
    if not post_to_delete.author == userID:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Only user who authored the post may delete')
    
    delete_success = await posts.deletePost(request, id)

    if delete_success:
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    
    raise HTTPException(status_code=404, detail=f'Post with id: {id} not found')