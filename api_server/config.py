from decouple import config

class DatabaseConfig:
    MONGODB_USERNAME = config("MONGO_INITDB_ROOT_USERNAME")
    MONGODB_PASSWORD  = config("MONGO_INITDB_ROOT_PASSWORD")
    MONGODB_HOST = "mongodb"
    MONGODB_PORT = 27017
    MONGODB_URL = f"mongodb://{MONGODB_USERNAME}:{MONGODB_PASSWORD}@{MONGODB_HOST}:{MONGODB_PORT}"
    DATABASE_NAME = config("DATABASE_NAME")
    
class JWTConfig:
    JWT_SECRET = config("JWT_SECRET")
    ALGORITHM="HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 30
    
class CrawlerConfig:
    CRAWLER_WEBSITE = config("CRAWLER_WEBSITE")
    

