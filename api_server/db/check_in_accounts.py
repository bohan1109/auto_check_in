from bson import ObjectId
import db.connect as db_module
from bson.errors import InvalidId
from bson import ObjectId
import models
from typing import Collection, Optional
from motor.motor_asyncio import AsyncIOMotorClient
from models.check_in_accounts import CheckInAccountCreate

class CheckInAccountDB:
    def __init__(self,db: Optional[AsyncIOMotorClient]=None) -> None:
        if db is None:
            self.db = db_module.db
        else:
            self.db = db
    async def create_check_in_account(self,check_in_account:CheckInAccountCreate):
        collection = self.db.check_in_accounts
        new_check_in_account = await collection.insert_one(check_in_account.dict())
        if new_check_in_account:
            return check_in_account
        else:
            raise ValueError("Check in account could not be created")