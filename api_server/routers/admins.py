from fastapi import APIRouter
from services import admins as AdminServiceModule
from models import admins as admins_model
from models import jwt as jwt_model
from fastapi import HTTPException,Depends
from fastapi.security import OAuth2PasswordBearer
from utils.jwt_utils import get_current_admin
from utils import jwt_utils as JWTUtilsModule
router = APIRouter()
import logging
logger = logging.getLogger(__name__)


def get_admins_service() -> AdminServiceModule.AdminService:
    return AdminServiceModule.AdminService()



        
@router.get("/protected")
async def read_protected_route(current_admin: admins_model.TokenData = Depends(get_current_admin)):
    return {"username": current_admin.username, "message": "Welcome to a protected route!"}

@router.get("/{admin_id}")
async def read_admin(admin_id: str,admins_service: AdminServiceModule.AdminService = Depends(get_admins_service),current_admin: admins_model.TokenData = Depends(get_current_admin)):
    try:
        admin_data =await admins_service.fetch_admin(admin_id)
        if admin_data is None:
            raise HTTPException(status_code=404, detail="Data not found")
        return admin_data
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        # 開法者模式使用
        # return {"error": str(e)}
        # 這裡捕獲了任何其他的異常
        raise HTTPException(detail="Server error",status_code=500)

@router.get("")
async def read_admins(admins_service: AdminServiceModule.AdminService = Depends(get_admins_service),current_admin: admins_model.TokenData = Depends(get_current_admin)):
    try:
        admin_data =await admins_service.fetch_admins()
        if admin_data is None:
            raise HTTPException(status_code=404, detail="Data not found")
        return admin_data
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(detail="Server error",status_code=500)

@router.post("")
async def create_admin(admin: admins_model.AdminCreate,admins_service: AdminServiceModule.AdminService = Depends(get_admins_service)):
    try:
        await admins_service.create_admin(admin)
        
        return {"detail": "success"}
    except ValueError as ve:  # For data validation errors
        logger.warning(f"Value error encountered: {str(ve)}")
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(detail=str(e),status_code=500)
        # raise HTTPException(detail="Server error",status_code=500)
        
@router.patch("/{admin_id}")
async def update_admin(admin_id: str,admin: admins_model.AdminUpdate,admins_service: AdminServiceModule.AdminService = Depends(get_admins_service),current_admin: admins_model.TokenData = Depends(get_current_admin)):
    try:
        await admins_service.update_admin(admin_id,admin)
        return {"detail": "success"}
    except ValueError as ve:  
        logger.warning(f"Value error encountered: {str(ve)}")
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(detail="Server error", status_code=500)
        
@router.delete("/{admin_id}")
async def delete_admin(admin_id: str,admins_service: AdminServiceModule.AdminService = Depends(get_admins_service),current_admin: admins_model.TokenData = Depends(get_current_admin)):
    try:
        await admins_service.delete_admin(admin_id)
        return {"detail": "success"}
    except ValueError as ve:  
        logger.warning(f"Value error encountered: {str(ve)}")
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(detail="Server error",status_code=500)
    
@router.post("/login")
async def admin_login(admin: admins_model.AdminLogin,admins_service: AdminServiceModule.AdminService = Depends(get_admins_service)):
    try:
        login_result = await admins_service.authenticate_admin(admin)
        if login_result:
            admin_data =await admins_service.fetch_admin_by_account(admin.account)
            access_token =JWTUtilsModule.JWTUtils.create_access_token(data={"sub": admin.account})
            return {"access_token": access_token, "token_type": "bearer"}
        else:
            raise HTTPException(detail="Account or password error",status_code=401)
    except ValueError as ve:  
        logger.warning(f"Value error encountered: {str(ve)}")
        raise HTTPException(status_code=400, detail=str(ve))
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(detail="Server error",status_code=500)
        # raise HTTPException(detail=str(e),status_code=500)

        

