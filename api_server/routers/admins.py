from fastapi import APIRouter
from services import admins as admins_service
router = APIRouter()

@router.get("/{admin_id}")
async def read_admin(admin_id: str,):
    admin_data =await admins_service.read_admin(admin_id)
    return admin_data