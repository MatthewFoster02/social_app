from typing import List, Optional
from pydantic import Field, BaseModel

from models.base import MongoBaseModel

# Defines the structure of a post object
class PostBase(MongoBaseModel):
    author:str = Field(...)
    content:str = Field(..., min_length=1)
    date_posted:int = Field(...)
    likes:int = Field(...)
    comments:Optional[List[str]] = None

class GptBase(BaseModel):
    prompt:str = Field(...)