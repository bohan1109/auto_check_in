from db import admins as AdminDBModule
from models import admins as admin_models
from typing import Optional

class AdminService:
    def __init__(self,admins_db: Optional[AdminDBModule.AdminDB] = None):
        if admins_db is None:
            admins_db = AdminDBModule.AdminDB()
        self._admins_db = admins_db

    async def fetch_admin(self, admin_id: str):
        result = await self._admins_db.read_admin_by_params("_id", admin_id)
        return result

    async def create_admin(self, admin: admin_models.AdminCreate):
        have_account = await self._admins_db.read_admin_by_params("account", admin.account)
        if have_account:
            raise ValueError("Account already exist")
        result = await self._admins_db.create_admin(admin)
        return result

    async def update_admin(self, admin_id: str, admin: admin_models.AdminUpdate):
        result = await self._admins_db.update_admin(admin_id, admin)
        return result
    
    async def delete_admin(self, admin_id: str):
        result = await self._admins_db.delete_admin(admin_id)
        return result
