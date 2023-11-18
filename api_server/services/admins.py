from db import admins as AdminDBModule
from models import admins as admin_models
from typing import Optional
import bcrypt



class AdminService:
    def __init__(self,admins_db: Optional[AdminDBModule.AdminDB] = None):
        if admins_db is None:
            admins_db = AdminDBModule.AdminDB()
        self._admins_db = admins_db

    async def fetch_admins(self):
        result = await self._admins_db.read_admin()
        return result

    async def fetch_admin(self, admin_id: str):
        result = await self._admins_db.read_admin_by_params("_id", admin_id)
        return result
    async def fetch_admin_by_account(self, admin_account: str):
        result = await self._admins_db.read_admin_by_params("account", admin_account)
        return result

    async def create_admin(self, admin: admin_models.AdminCreate):
        have_account = await self._admins_db.read_admin_by_params("account", admin.account)
        if have_account:
            raise ValueError("Account already exist")
        password_bytes = admin.password.encode("utf-8")
        admin.password = bcrypt.hashpw(password_bytes, bcrypt.gensalt())
        result = await self._admins_db.create_admin(admin)
        return result

    async def update_admin(self, admin_id: str, admin: admin_models.AdminUpdate):
        admin_data = {}
        if admin.password:
            password_bytes = admin.password.encode("utf-8")
            hashed_password = bcrypt.hashpw(password_bytes, bcrypt.gensalt())
            admin_data["password"] = hashed_password

        if admin.username:
            admin_data["username"] = admin.username
        if admin.role:
            admin_data["role"] = admin.role
        result = await self._admins_db.update_admin(admin_id, admin_data)
        return result
    
    async def delete_admin(self, admin_id: str):
        result = await self._admins_db.delete_admin(admin_id)
        return result
    
    async def authenticate_admin(self, admin: admin_models.AdminLogin):
        admin_data = await self._admins_db.read_admin_by_params("account",admin.account)
        if not admin_data:
            return False
        stored_password = admin_data["password"]
        password_bytes = admin.password.encode("utf-8")
        return self.authenticate_password(password_bytes,stored_password)
        
    @staticmethod
    def authenticate_password(password: str, hashed_password: str) -> bool:
        if bcrypt.checkpw(password, hashed_password):
            return True
        else:
            return False
        

