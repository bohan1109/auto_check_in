from decouple import config

class DatabaseConfig:
    MONGODB_URL = config("MONGODB_URL")
    DATABASE_NAME = config("DATABASE_NAME")
    
class JWTConfig:
    JWT_SECRET = config("JWT_SECRET")
    ALGORITHM="HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 30