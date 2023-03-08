from bson import ObjectId
from pydantic import BaseModel, Field

class PyObjectID(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not(ObjectId.is_valid(v)):
            raise ValueError("Invalid Object")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

class MongoBaseModel(BaseModel):
    id: PyObjectID = Field(default_factory=PyObjectID, alias='_id')
    class Config:
        json_encoders = {ObjectId: str}