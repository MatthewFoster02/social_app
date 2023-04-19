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
    post = await request.app.mongodb['posts'].find_one({'_id': postID})
    if not post['comments'] is None:
        for comment_id in post['comments']:
            await deletePost(request, comment_id)
    deleted = await request.app.mongodb['posts'].delete_one({'_id': postID})
    return deleted.deleted_count == 1

async def increaseLikes(request:Request, id:str, userID:str):
    post = await request.app.mongodb['posts'].find_one({'_id': id})
    likers = []
    if post['likers'] is not None:
        likers = post['likers']
    likers.append(userID)

    await request.app.mongodb['posts'].update_one(
        {'_id': id},
        {'$inc': {'likes': 1}, '$set': {'likers': likers}}
    )
    updated_post = await request.app.mongodb['posts'].find_one({'_id': id})
    return PostBase(**updated_post) if updated_post is not None else None

async def decreaseLikes(request:Request, id:str, userID:str):
    post = await request.app.mongodb['posts'].find_one({'_id': id})
    likers = post['likers']
    likers.remove(userID)

    await request.app.mongodb['posts'].update_one(
        {'_id': id},
        {'$inc': {'likes': -1}, '$set': {'likers': likers}}
    )
    updated_post = await request.app.mongodb['posts'].find_one({'_id': id})
    return PostBase(**updated_post) if updated_post is not None else None

async def createComment(request:Request, newPost:PostBase, id:str):
    newComment = await createPost(request, newPost)

    parentPost = await request.app.mongodb['posts'].find_one({'_id': id})
    updated_comments = []
    if parentPost['comments'] is not None:
        updated_comments = parentPost['comments']
    updated_comments.append(newComment['_id'])
    await request.app.mongodb['posts'].update_one(
        {'_id': parentPost['_id']}, {'$set': {'comments': updated_comments}}
    )
    return newComment

async def getCommentsByID(request:Request, id:str):
    post = await request.app.mongodb['posts'].find_one({'_id': id})

    if post is None:
        return 'No post'

    if post['comments'] is None:
        return 'No comments'
    comments = []
    for commentID in post['comments']:
        comment = await getPostByID(request, commentID)
        comments.append(comment)
    return comments

async def removeComment(request:Request, id:str):
    parentPost = await request.app.mongodb['posts'].find_one({'comments': id})

    if parentPost is None:
        return 'No post'

    if parentPost['comments'] is None:
        return 'No comments'
    
    old_comments = parentPost['comments']
    old_comments.remove(id)
    await request.app.mongodb['posts'].update_one(
        {'_id': parentPost['_id']}, {'$set': {'comments': old_comments}}
    )

async def updatePostPic(request:Request, authorID:str, profile_pic_url:str):
    await request.app.mongodb['posts'].update_many(
        {'author': authorID}, {'$set': {'author_profile_pic': profile_pic_url}}
    )
