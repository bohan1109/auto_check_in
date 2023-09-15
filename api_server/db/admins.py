from bson import ObjectId
import db.connect as db_module
from bson.errors import InvalidId
from bson import ObjectId
import bcrypt
from models.admins import AdminCreate

def is_valid_objectid(id_str: str) -> bool:
    try:
        ObjectId(id_str)
        return True
    except InvalidId:
        return False

async def read_admin_by_params(params: str, params_value: str):
    query = {}
    if params == "_id" and is_valid_objectid(params_value):
        query[params] = ObjectId(params_value)
    else:
        query[params] = params_value

    collection = db_module.db.admins

    admin_data = await collection.find_one(query)

    if admin_data is None:
        return None

    admin_data["_id"] = str(admin_data["_id"])
    return admin_data

async def create_admin_to_db(admin:AdminCreate):
    password_bytes = admin.password.encode('utf-8')
    hashed_password = bcrypt.hashpw(password_bytes, bcrypt.gensalt())
    collection = db_module.db.admins
    admin_data = {
        "account": admin.account,
        "password": hashed_password,  
        "username": admin.username
    }
    new_admin = await collection.insert_one(admin_data)
    if new_admin:
        return admin
    else:
        raise ValueError("Admin could not be created")





