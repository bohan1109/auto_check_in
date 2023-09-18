from db import check_in_accounts as CheckInAccountDBModule
from models import check_in_accounts as check_in_accounts_models
from typing import Optional
from crawlers.check_in_crawlers import CheckInCrawler

class CheckInAccountService:
    def __init__(self,check_in_accounts_db: Optional[CheckInAccountDBModule.CheckInAccountDB] = None) -> None:
        if check_in_accounts_db is None:
            check_in_accounts_db=CheckInAccountDBModule.CheckInAccountDB()
        self._check_in_account_db=check_in_accounts_db
        
    async def create_check_in_account(self,check_in_account:check_in_accounts_models.CheckInAccountCreate):
        crawler_instance = CheckInCrawler()
        login_success = crawler_instance.login_result(check_in_account)
        if login_success:
            
            check_in_account.login_success=True
        else:
            return False
        crawler_instance.close()
        result = await self._check_in_account_db.create_check_in_account(check_in_account)
        return result