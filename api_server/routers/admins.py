from fastapi import APIRouter
from fastapi.responses import JSONResponse
from services import admins as admins_service
from models import admins as admins_model
from fastapi import HTTPException
router = APIRouter()

@router.get("/{admin_id}")
async def read_admin(admin_id: str):
    try:
        admin_data =await admins_service.fetch_admin(admin_id)
        if admin_data is None:
            raise HTTPException(status_code=404, detail="Data not found")
        return admin_data
    except HTTPException as he:
        raise he
    except Exception as e:
        # 開法者模式使用
        return {"error": str(e)}
        # 這裡捕獲了任何其他的異常
        # raise HTTPException(content={"message":"Server error"},status_code=500)

@router.post("/")
async def create_admin(admin: admins_model.AdminCreate):
    try:
        await admins_service.create_admin_to_service(admin)
        return {"detail": "success"}
    except ValueError as ve:  # For data validation errors
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        # 開法者模式使用
        # return {"error": str(e)}
        # raise HTTPException(content={"message":e},status_code=500)
        # 這裡捕獲了任何其他的異常
        raise HTTPException(detail={"detail": str(e)}, status_code=500)
        # raise HTTPException(content={"message":"Server error"},status_code=500)
        
@router.patch("/{admin_id}")
async def update_admin(admin_id: str,admin: admins_model.AdminUpdate):
    try:
        await admins_service.update_admin_to_service(admin_id,admin)
        return {"detail": "success"}
    except ValueError as ve:  # For data validation errors
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        # 開法者模式使用
        # return {"error": str(e)}
        # raise HTTPException(content={"message":e},status_code=500)
        # 這裡捕獲了任何其他的異常
        raise HTTPException(detail={"detail": str(e)}, status_code=500)
        # raise HTTPException(content={"message":"Server error"},status_code=500)