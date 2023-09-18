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
            
    @staticmethod
    def is_valid_objectid(id_str: str) -> bool:
        try:
            ObjectId(id_str)
            return True
        except InvalidId:
            return False
            
    async def create_check_in_account(self,check_in_account:CheckInAccountCreate):
        collection = self.db.check_in_accounts
        new_check_in_account = await collection.insert_one(check_in_account.dict())
        if new_check_in_account:
            return check_in_account
        else:
            raise ValueError("Check in account could not be created")
        
    async def read_check_in_account_by_params(self, params: str, params_value: str):
        query = {}
        if params == "_id" and self.is_valid_objectid(params_value):
            query[params] = ObjectId(params_value)
        else:
            query[params] = params_value

        collection = self.db.check_in_accounts

        admin_data = await collection.find_one(query)

        if admin_data is None:
            return None

        admin_data["_id"] = str(admin_data["_id"])
        return admin_data