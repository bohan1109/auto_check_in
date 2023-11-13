from pydantic import BaseModel, validator
from typing import Optional
from enum import Enum

class Role(str, Enum):
    ADMIN = "admin"
    USER = "user" 


class AdminCreate(BaseModel):
    account:str
    password: str
    confirm_password: str
    username: str
    role: Role

    @validator("account", "username", "password", "confirm_password","role", pre=True)
    def check_empty(cls, value):
        if value is None or str(value).strip() == "":
            raise ValueError("Data can not be empty")
        return value
    
    @validator("confirm_password", pre=True, always=True)
    def check_passwords_match(cls, confirm_password, values):
        if 'password' in values and confirm_password != values['password']:
            raise ValueError("Password and Confirm Password do not match")
        return confirm_password
    
class AdminUpdate(BaseModel):
    password: Optional[str] = None
    confirm_password: Optional[str] = None
    username: Optional[str] = None
    role: Optional[Role] = None
    
    @validator("confirm_password", pre=True, always=True)
    def check_passwords_match(cls, confirm_password, values):
        if 'password' in values and confirm_password != values['password']:
            raise ValueError("Password and Confirm Password do not match")
        return confirm_password
    
class AdminLogin(BaseModel):
    account:str
    password:str
    
    @validator("account", "password", pre=True)
    def check_empty(cls, value):
        if value is None or str(value).strip() == "":
            raise ValueError("Data can not be empty")
        return value
    
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[str] = None
    
