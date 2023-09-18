from pydantic import BaseModel, validator
from typing import Optional

class CheckInAccountCreate(BaseModel):
    check_in_account:str
    check_in_password: str
    login_success: Optional[bool] = None
    check_in_username: str

    @validator("check_in_account", "check_in_password", "check_in_username", pre=True)
    def check_empty(cls, value):
        if value is None or str(value).strip() == "":
            raise ValueError("Data can not be empty")
        return value
    