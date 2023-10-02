from db import check_in_accounts as CheckInAccountDBModule
from models import check_in_accounts as check_in_accounts_models
from typing import Optional
from utils.check_in_crawlers import CheckInCrawler

class CheckInAccountService:
    def __init__(self,check_in_accounts_db: Optional[CheckInAccountDBModule.CheckInAccountDB] = None) -> None:
        if check_in_accounts_db is None:
            check_in_accounts_db=CheckInAccountDBModule.CheckInAccountDB()
        self._check_in_account_db=check_in_accounts_db
        
    async def create_check_in_account(self,check_in_account:check_in_accounts_models.CheckInAccountCreate):
        have_check_in_account = await self._check_in_account_db.read_check_in_account_by_params("check_in_account", check_in_account.check_in_account)
        if have_check_in_account:
            raise ValueError("Check in account already exist")
        crawler_instance = CheckInCrawler()
        login_success = crawler_instance.login_result(check_in_account)
        if login_success:
            
            check_in_account.login_success=True
        else:
            return False
        
        
        result = await self._check_in_account_db.create_check_in_account(check_in_account)
        return result
    
    async def fetch_check_in_account(self,check_in_account_id:str):
        result = await self._check_in_account_db.read_check_in_account_by_params("_id",check_in_account_id)
        return result
    
    async def fetch_check_in_accounts(self):
        result = await self._check_in_account_db.read_check_in_accounts()
        return result
    
    async def update_check_in_account(self,check_in_account_id:str,check_in_account:check_in_accounts_models.CheckInAccountUpdate):
        if check_in_account.check_in_account:
            read_check_in_account_by_account = await self._check_in_account_db.read_check_in_account_by_params("check_in_account", check_in_account.check_in_account)
            if read_check_in_account_by_account and read_check_in_account_by_account["_id"] != check_in_account_id:
                raise ValueError("Check in account already exist")
        crawler_instance = CheckInCrawler()
        login_success = crawler_instance.login_result(check_in_account)
        if login_success:
            
            check_in_account.login_success=True
        else:
            return False
        result = await self._check_in_account_db.update_check_in_account(check_in_account_id,check_in_account.dict())
        return result
    
    async def delete_check_in_account(self,check_in_account_id:str):
        result = await self._check_in_account_db.delete_check_in_account(check_in_account_id)
        return result