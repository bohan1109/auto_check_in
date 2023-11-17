from pydantic import BaseModel, validator
from typing import Optional

class CheckInAccountCreate(BaseModel):
    check_in_account:str
    check_in_password: str
    login_success: Optional[bool] = None
    check_in_username: str
    owner:Optional[str] = None
    check_in_time:str
    check_out_time:str

    @validator("check_in_account", "check_in_password", "check_in_username","check_in_time","check_out_time", pre=True)
    def check_empty(cls, value):
        if value is None or str(value).strip() == "":
            raise ValueError("Data can not be empty")
        return value
    

class CheckInAccountUpdate(BaseModel):
    check_in_account:Optional[str] = None
    check_in_password: Optional[str] = None
    login_success: Optional[bool] = None
    check_in_username: Optional[str] = None
    check_in_time:Optional[str] = None
    check_out_time:Optional[str] = None