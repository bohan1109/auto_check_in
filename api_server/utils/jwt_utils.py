import jwt
from datetime import datetime, timedelta
from config import JWTConfig
from models import jwt as jwt_models

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
            raise jwt_models.JWTError("Could not validate credentials")
