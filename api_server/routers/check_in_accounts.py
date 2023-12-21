from fastapi import APIRouter
from services import check_in_accounts as CheckInAccountServiceModule
from fastapi import HTTPException, Depends
from models import check_in_accounts as check_in_accounts_model
from fastapi.security import OAuth2PasswordBearer
from utils.jwt_utils import get_current_admin
from models import admins as admins_model
import logging
logger = logging.getLogger(__name__)
router = APIRouter()


def get_check_in_account_service() -> CheckInAccountServiceModule.CheckInAccountService:
    return CheckInAccountServiceModule.CheckInAccountService()


@router.post("")
async def create_check_in_account(
    check_in_account: check_in_accounts_model.CheckInAccountCreate,
    check_in_accounts_service: CheckInAccountServiceModule.CheckInAccountService = Depends(get_check_in_account_service),
    current_admin: admins_model.TokenData = Depends(get_current_admin)    
):
    try:
        check_in_account.owner=current_admin.account
        result = await check_in_accounts_service.create_check_in_account(
            check_in_account
        )
        if result:
            return {"detail": "success"}
        else:
            raise ValueError("Check in account login fail")
    except HTTPException as he:
        raise he    
    except ValueError as ve:   
        logger.warning(f"Value error encountered: {str(ve)}")
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(detail="Server error", status_code=500)
        # raise HTTPException(detail=str(e), status_code=500)
    
@router.get("/{check_in_account_id}")
async def create_check_in_account(
    check_in_account_id: str,
    check_in_accounts_service: CheckInAccountServiceModule.CheckInAccountService = Depends(get_check_in_account_service),
    current_admin: admins_model.TokenData = Depends(get_current_admin)    
):
    try:
        check_in_account_data = await check_in_accounts_service.fetch_check_in_account_by_id(
            check_in_account_id
        )
        if check_in_account_data is None:
            raise HTTPException(status_code=404, detail="Data not found")
        return check_in_account_data
    except HTTPException as he:
        raise he
    except ValueError as ve:  
        logger.warning(f"Value error encountered: {str(ve)}")
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(detail="Server error", status_code=500)
    
@router.get("")
async def read_check_in_accounts(check_in_accounts_service: CheckInAccountServiceModule.CheckInAccountService = Depends(get_check_in_account_service),
    current_admin: admins_model.TokenData = Depends(get_current_admin)):
    try:
        check_in_accounts_data =await check_in_accounts_service.fetch_check_in_accounts()
        if check_in_accounts_data is None:
            raise HTTPException(status_code=404, detail="Data not found")
        return check_in_accounts_data
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(detail="Server error",status_code=500)
    
@router.patch("/{check_in_account_id}")
async def patch_check_in_account(
    check_in_account_id: str,
    check_in_account: check_in_accounts_model.CheckInAccountUpdate,
    check_in_accounts_service: CheckInAccountServiceModule.CheckInAccountService = Depends(get_check_in_account_service),
    current_admin: admins_model.TokenData = Depends(get_current_admin) 
):
    try:
        check_in_account_data =await check_in_accounts_service.fetch_check_in_account_by_id(check_in_account_id)
        print(current_admin)
        print(check_in_account_data['owner'])
        if check_in_account_data['owner'] != current_admin.account and current_admin.role!="admin":
            raise HTTPException(status_code=403, detail="Permission denied")
        result = await check_in_accounts_service.update_check_in_account(check_in_account_id,check_in_account)
        if not result:
            raise ValueError("Check in account login fail")
        return {"detail": "success"}
    except ValueError as ve:  
        logger.warning(f"Value error encountered: {str(ve)}")
        raise HTTPException(status_code=400, detail=str(ve))
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(detail="Server error", status_code=500)

@router.delete("/{check_in_account_id}")
async def delete_check_in_account(
    check_in_account_id: str,
    check_in_accounts_service: CheckInAccountServiceModule.CheckInAccountService = Depends(get_check_in_account_service),
    current_admin: admins_model.TokenData = Depends(get_current_admin) 
):
    try:
        check_in_account_data =await check_in_accounts_service.fetch_check_in_account_by_id(check_in_account_id)
        if check_in_account_data['owner'] != current_admin.account or current_admin.role!="admin":
            raise HTTPException(status_code=403, detail="Permission denied")
        await check_in_accounts_service.delete_check_in_account(check_in_account_id)
        return {"detail": "success"}
    except ValueError as ve:  
        logger.warning(f"Value error encountered: {str(ve)}")
        raise HTTPException(status_code=400, detail=str(ve))
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(detail="Server error", status_code=500)