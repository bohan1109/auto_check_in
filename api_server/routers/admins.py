from fastapi import APIRouter
from services import admins as AdminServiceModule
from models import admins as admins_model
from fastapi import HTTPException,Depends
router = APIRouter()


def get_admins_service() -> AdminServiceModule.AdminService:
    return AdminServiceModule.AdminService()


@router.get("/{admin_id}")
async def read_admin(admin_id: str,admins_service: AdminServiceModule.AdminService = Depends(get_admins_service)):
    try:
        admin_data =await admins_service.fetch_admin(admin_id)
        if admin_data is None:
            raise HTTPException(status_code=404, detail="Data not found")
        return admin_data
    except HTTPException as he:
        raise he
    except Exception as e:
        # 開法者模式使用
        # return {"error": str(e)}
        # 這裡捕獲了任何其他的異常
        raise HTTPException(detail="Server error",status_code=500)

@router.post("/")
async def create_admin(admin: admins_model.AdminCreate,admins_service: AdminServiceModule.AdminService = Depends(get_admins_service)):
    try:
        await admins_service.create_admin(admin)
        return {"detail": "success"}
    except ValueError as ve:  # For data validation errors
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(detail="Server error",status_code=500)
        
@router.patch("/{admin_id}")
async def update_admin(admin_id: str,admin: admins_model.AdminUpdate,admins_service: AdminServiceModule.AdminService = Depends(get_admins_service)):
    try:
        await admins_service.update_admin(admin_id,admin)
        return {"detail": "success"}
    except ValueError as ve:  
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(detail="Server error", status_code=500)
        
@router.delete("/{admin_id}")
async def delete_admin(admin_id: str,admins_service: AdminServiceModule.AdminService = Depends(get_admins_service)):
    try:
        await admins_service.delete_admin(admin_id)
        return {"detail": "success"}
    except ValueError as ve:  
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(detail="Server error",status_code=500)
    
@router.post("/login")
async def admin_login(admin: admins_model.AdminLogin,admins_service: AdminServiceModule.AdminService = Depends(get_admins_service)):
    try:
        login_result = await admins_service.authenticate_admin(admin)
        if login_result:
            return {"detail": "success"}
        else:
            raise HTTPException(detail="Account or password error",status_code=401)
    except ValueError as ve:  
        raise HTTPException(status_code=400, detail=str(ve))
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(detail="Server error",status_code=500)
        # raise HTTPException(detail="Server error",status_code=500)