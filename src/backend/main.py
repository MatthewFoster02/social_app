import uvicorn
from decouple import config
from fastapi import FastAPI
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient

from routers.users import router as users_router
from routers.posts import router as posts_router

DB_URL = config('DN_URL', cast=str)
DB_NAME = config('DN_NAME', cast=str)

middleware = [
    Middleware(
        CORSMiddleware,
        allow_origins=['*'], # Change when deploying
        allow_credentials=True,
        allow_methods=['*'],
        allow_headers=['*']
    )
]

app = FastAPI(middleware=middleware)

app.include_router(users_router, prefix='/users', tags=['users'])
app.include_router(posts_router, prefix='/posts', tags=['posts'])

@app.on_event('startup')
async def startup_db_client():
    app.mongodb_client = AsyncIOMotorClient(DB_URL)
    app.mongodb = app.mongodb_client[DB_NAME]

@app.on_event('shutdown')
async def shutdown_db_client():
    app.mongodb_client.close()

# run with python main.py
if __name__ == '__main__':
    uvicorn.run(
        'main:app',
        reload=True
    )
