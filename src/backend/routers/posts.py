from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Request, Response, status, Body
from fastapi.responses import JSONResponse

from crud import posts, users
from models.posts import PostBase
from authentication import Authorization

router = APIRouter()
authorization = Authorization()

@router.post('/', response_description='Create new post')
async def create(request:Request, post:PostBase=Body(...), userID=Depends(authorization.authWrapper)):
    # Check that author of post is the current authenticated user
    if not post.author == userID:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='User attempting to author someone elses post')
    created_post = await posts.createPost(request, post)
    return JSONResponse(status_code=status.HTTP_201_CREATED, content=created_post)

@router.get('/', response_description='Get all posts matching query')
async def get_all(request:Request, userID:Optional[str]=None, page:int=1):
    # Check that the query ID exists if one was included in request
    if userID is not None:
        user = await users.getUser(request, userID, '_id', False)
        if user is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'User with id: {userID} not found')
    return await posts.getAllPosts(request, userID, page)

@router.get('/{id}', response_description='Get post with ID')
async def post_by_id(request:Request, id:str):
    post = await posts.getPostByID(request, id)

    if post is not None:
        return post
    
    raise HTTPException(status_code=404, detail=f'Post with id: {id} not found')

@router.delete('/{id}', response_description='Delete post with ID')
async def delete_post(request:Request, id:str, userID=Depends(authorization.authWrapper), comment:bool=False):
    post_to_delete = await posts.getPostByID(request, id)

    if post_to_delete is None:
        raise HTTPException(status_code=404, detail=f'Post with id: {id} not found')
    
    if not post_to_delete.author == userID:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Only user who authored the post may delete')
    
    delete_success = await posts.deletePost(request, id)

    if delete_success:
        if comment:
            await posts.removeComment(request, id)
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    
    raise HTTPException(status_code=404, detail=f'Post with id: {id} not found')

@router.patch('/like/{id}', response_description='Increase like count on post matching ID')
async def increase_like_count(request:Request, id:str):
    post = await posts.increaseLikes(request, id)

    if post is not None:
        return post
    
    raise HTTPException(status_code=404, detail=f'Post with id: {id} not found')

@router.post('/comment/{id}', response_description='Create comment on post with ID')
async def create_comment(request:Request, id:str, comment:PostBase=Body(...), userID=Depends(authorization.authWrapper)):
    if not comment.author == userID:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='User attempting to author someone elses comment')
    created_post = await posts.createComment(request, comment, id)
    return JSONResponse(status_code=status.HTTP_201_CREATED, content=created_post)

@router.get('/comment/{id}', response_description='Get all comments on post with ID')
async def get_all_comments(request:Request, id:str):
    comments = await posts.getCommentsByID(request, id)

    if comments == 'No comments':
        return JSONResponse(status_code=status.HTTP_200_OK, content={'message': 'No comments'})
    
    if not comments == 'No post':
        return comments
    
    raise HTTPException(status_code=404, detail=f'Post with id: {id} not found')
