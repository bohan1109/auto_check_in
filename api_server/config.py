from decouple import config

class DatabaseConfig:
    MONGODB_URL = config("MONGODB_URL")
    DATABASE_NAME = config("DATABASE_NAME")