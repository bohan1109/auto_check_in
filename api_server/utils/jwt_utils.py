import jwt
from datetime import datetime, timedelta
from config import JWTConfig
from models import jwt as jwt_model
from models import admins as admins_model
from fastapi import HTTPException,Depends
from fastapi.security import OAuth2PasswordBearer
from utils import jwt_utils as JWTUtilsModule
class JWTUtils:
    
    @staticmethod
    def create_access_token(data: dict):
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(days=JWTConfig.ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, JWTConfig.JWT_SECRET, algorithm=JWTConfig.ALGORITHM)
        return encoded_jwt
    
    @staticmethod
    def decode_jwt_token(token: str) -> dict:
        try:
            payload = jwt.decode(token, JWTConfig.JWT_SECRET, algorithms=[JWTConfig.ALGORITHM])
            return payload
        except jwt.JWTError:
            raise jwt_model.JWTError("Could not validate credentials")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_current_admin(token: str = Depends(oauth2_scheme)) -> admins_model.TokenData:
    try:
        payload = JWTUtilsModule.JWTUtils.decode_jwt_token(token)
    except jwt_model.JWTError:
        raise HTTPException(
            status_code=401,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    username: str = payload.get("sub")
    if username is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    return admins_model.TokenData(username=username)