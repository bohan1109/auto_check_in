from unittest import result
from db import admins as admins_db
from models import admins as admin_models


async def fetch_admin(admin_id: str):
    result = await admins_db.read_admin_by_params("_id", admin_id)
    return result



async def create_admin_to_service(admin: admin_models.AdminCreate):
    have_account = await admins_db.read_admin_by_params("account",admin.account)
    if have_account:
        raise ValueError("Account already exist")
    result = await admins_db.create_admin_to_db(admin)
    return result

async def update_admin_to_service(admin_id: str,admin: admin_models.AdminUpdate):
    result = await admins_db.update_admin_to_db(admin_id,admin)
    return result
