from pydantic import BaseModel, validator

class AdminCreate(BaseModel):
    account:str
    password: str
    confirm_password: str
    username: str

    @validator("account", "username", "password", "confirm_password", pre=True)
    def check_empty(cls, value):
        if value is None or str(value).strip() == "":
            raise ValueError("Data can not be empty")
        return value
    
    @validator("confirm_password", pre=True, always=True)
    def check_passwords_match(cls, confirm_password, values):
        if 'password' in values and confirm_password != values['password']:
            raise ValueError("Password and Confirm Password do not match")
        return confirm_password