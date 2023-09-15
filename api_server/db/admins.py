from bson import ObjectId
from config import DatabaseConfig
# from db.connect import db  # Import the db from connect.py
import db.connect as db_module
def is_valid_objectid(oid: str) -> bool:
    """
    Check if a string is a valid ObjectId.
    """
    return ObjectId.is_valid(oid)

async def read_admin(admin_id: str):
    # Check if the provided string is a valid ObjectId
    if not is_valid_objectid(admin_id):
        return {"error": "AdminId error"}

    collection = db_module.db.admins  # Directly use the db from connect.py

    admin_data = await collection.find_one({"_id": ObjectId(admin_id)})

    if admin_data:
        admin_data["_id"] = str(admin_data["_id"])
        return {"data":admin_data}
    else:
        return {"error": "Admin not found"}
