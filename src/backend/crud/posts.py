import math
from typing import Optional
from fastapi import Request
from fastapi.encoders import jsonable_encoder

from models.posts import PostBase

# Constant
RESULTS_PER_PAGE = 20

async def createPost(request:Request, newPost:PostBase):
    newPost = jsonable_encoder(newPost) # Encode as JSON
    post = await request.app.mongodb['posts'].insert_one(newPost)
    return await request.app.mongodb['posts'].find_one({'_id': post.inserted_id})

async def getAllPosts(request:Request, userID:Optional[int], page:int=1):
    skip = (page - 1) * RESULTS_PER_PAGE # Calculate skip
    query = {}

    # Add userID to query if part of request
    if userID:
        query['author'] = userID
    
    # Calculate total pages of results
    pages = math.ceil(
        await request.app.mongodb["posts"].count_documents(query) / RESULTS_PER_PAGE
    )
    results = request.app.mongodb['posts'].find(query).sort('_id', 1).skip(skip).limit(RESULTS_PER_PAGE)
    posts = [PostBase(**raw_post) async for raw_post in results]
    return {'posts': posts, 'total_pages': pages}

async def getPostByID(request:Request, postID:str):
    post = await request.app.mongodb['posts'].find_one({'_id': postID})

    return PostBase(**post) if post is not None else None

async def deletePost(request:Request, postID:str):
    deleted = await request.app.mongodb['posts'].delete_one({'_id': postID})
    return deleted.deleted_count == 1
