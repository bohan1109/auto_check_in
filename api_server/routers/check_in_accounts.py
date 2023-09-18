from fastapi import APIRouter
from services import check_in_accounts as CheckInAccountServiceModule
from fastapi import HTTPException,Depends
from models import check_in_accounts as check_in_accounts_model
from fastapi.security import OAuth2PasswordBearer
router = APIRouter()

def get_check_in_account_service() -> CheckInAccountServiceModule.CheckInAccountService:
    return CheckInAccountServiceModule.CheckInAccountService()

@router.post("/")
async def create_check_in_account(check_in_account: check_in_accounts_model.CheckInAccountCreate,check_in_accounts_service: CheckInAccountServiceModule.CheckInAccountService = Depends(get_check_in_account_service)):
    try:
        
        result = await check_in_accounts_service.create_check_in_account(check_in_account)
        
        if result:
            return {"detail": "success"}
        else:
            raise HTTPException(status_code=400,detail="Login fail")
    except ValueError as ve:  # For data validation errors
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(detail="Server error",status_code=500)
