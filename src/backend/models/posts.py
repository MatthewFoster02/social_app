from typing import List, Optional
from pydantic import Field

from models.base import MongoBaseModel

# Defines the structure of a post object
class PostBase(MongoBaseModel):
    author:str = Field(...)
    content:str = Field(..., min_length=1, max_length=280)
    date_posted:int = Field(...)
    likes:int = Field(...)
    comments:Optional[List[str]] = None
