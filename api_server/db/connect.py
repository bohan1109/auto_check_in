from motor.motor_asyncio import AsyncIOMotorClient
from fastapi import FastAPI
from config import DatabaseConfig

client: AsyncIOMotorClient = None
db = None

async def connect_to_mongo(app: FastAPI):
    global client, db
    client = AsyncIOMotorClient(DatabaseConfig.MONGODB_URL)
    db = client[DatabaseConfig.DATABASE_NAME]
    print("Successfully connected to MongoDB!")

async def close_mongo_connection(app: FastAPI):
    client.close()
    print("MongoDB connection closed.")
