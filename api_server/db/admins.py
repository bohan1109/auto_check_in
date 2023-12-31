from bson import ObjectId
import db.connect as db_module
from bson.errors import InvalidId
from bson import ObjectId
from typing import Optional
from motor.motor_asyncio import AsyncIOMotorClient
from models.admins import AdminCreate

class AdminDB:

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

    async def read_admin_by_params(self, params: str, params_value: str):
        query = {}
        if params == "_id" and self.is_valid_objectid(params_value):
            query[params] = ObjectId(params_value)
        else:
            query[params] = params_value

        collection = self.db.admins

        admin_data = await collection.find_one(query)

        if admin_data is None:
            return None

        admin_data["_id"] = str(admin_data["_id"])
        return admin_data

    async def read_admin(self):
        collection = self.db.admins
        admin_data = await collection.find().to_list(length=1000)
        if not admin_data:
            return None
        for item in admin_data:
            item["_id"] = str(item["_id"])
        return admin_data

    async def create_admin(self, admin: AdminCreate):
        collection = self.db.admins
        admin_data = {
            "account": admin.account,
            "password": admin.password,
            "username": admin.username,
            "role": admin.role,
        }
        new_admin = await collection.insert_one(admin_data)
        if new_admin:
            return admin
        else:
            raise ValueError("Admin could not be created")

    async def update_admin(self, admin_id: str, admin_data: dict()):
        collection = self.db.admins

        result = await collection.update_one(
            {"_id": ObjectId(admin_id)}, {"$set": admin_data}
        )

        if result.modified_count > 0:
            return admin_data
        else:
            raise ValueError("Admin could not be updated")
        
    async def delete_admin(self,admin_id:str):
        collection = self.db.admins
        
        result = await collection.delete_one(
            {"_id": ObjectId(admin_id)}
        )

        if result.deleted_count > 0:
            return {"message": "Admin successfully deleted."}
        else:
            raise ValueError("Admin could not be updated")