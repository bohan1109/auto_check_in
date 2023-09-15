from db import admins as admins_db


async def read_admin(admin_id: str):
    admin_data =await admins_db.read_admin(admin_id)
    return admin_data