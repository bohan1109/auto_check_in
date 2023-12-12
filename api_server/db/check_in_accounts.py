from gc import collect
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
        check_in_account_data = {
            "check_in_username": check_in_account.check_in_username,
            "check_in_account": check_in_account.check_in_account,
            "check_in_password": check_in_account.check_in_password,
            "check_in_time": check_in_account.check_in_time,
            "check_out_time": check_in_account.check_out_time,
            "login_success": check_in_account.login_success,
            "owner": check_in_account.owner,
            "use_random_check_in":check_in_account.use_random_check_in
        }
        new_check_in_account = await collection.insert_one(check_in_account_data)
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

        check_in_account_data = await collection.find_one(query)

        if check_in_account_data is None:
            return None

        check_in_account_data["_id"] = str(check_in_account_data["_id"])
        return check_in_account_data
    
    async def read_check_in_accounts(self):
        collection = self.db.check_in_accounts
        check_in_account_data = await collection.find().to_list(length=1000)
        if not check_in_account_data:
            return None
        for item in check_in_account_data:
            item["_id"] = str(item["_id"])
        return check_in_account_data
    
    async def update_check_in_account(self, check_in_accounts_id: str, check_in_account_data: dict()):
        collection = self.db.check_in_accounts

        result = await collection.update_one(
            {"_id": ObjectId(check_in_accounts_id)}, {"$set": check_in_account_data}
        )

        if result.modified_count > 0:
            return check_in_account_data
        else:
            raise ValueError("Check in account could not be updated")
        
    async def delete_check_in_account(self,check_in_account_id:str):
        collection = self.db.check_in_accounts
        result = await collection.delete_one(
            {"_id": ObjectId(check_in_account_id)}
        )

        if result.deleted_count > 0:
            return {"message": "Check in account successfully deleted."}
        else:
            raise ValueError("Check in account delete fail")