from typing import Optional
from fastapi import Request

from models.posts import PostBase

async def createPost(request:Request, newPost:PostBase):
    post = await request.app.mongodb['posts'].insert_one(newPost)
    return await request.app.mongodb['posts'].find_one({'_id': post.inserted_id})

async def getAllPosts(request:Request, userID:Optional[int], page:int=1):
    RESULTS_PER_PAGE = 20
    skip = (page - 1) * RESULTS_PER_PAGE
    query = {}

    if userID:
        query['author'] = userID
    
    results = await request.app.mongodb['posts'].find(query).skip(skip).limit(RESULTS_PER_PAGE)
    return [PostBase(**raw_post) async for raw_post in results]

async def getPostByID(request:Request, postID:int):
    post = await request.app.mongodb['posts'].find_one({'_id': postID})

    return PostBase(**post) if post is not None else None

async def deletePost(request:Request, postID:int):
    deleted = await request.app.mongodb['posts'].delete_one({'_id': postID})
    return deleted.deleted_count == 1
