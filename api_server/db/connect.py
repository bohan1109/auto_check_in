from motor.motor_asyncio import AsyncIOMotorClient
import logging
from fastapi import FastAPI
from config import DatabaseConfig

# Setting up the logger
logger = logging.getLogger()
client: AsyncIOMotorClient = None
db = None

async def connect_to_mongo(app: FastAPI):
    global client, db
    logger.info("Trying to connect to MongoDB")
    client = AsyncIOMotorClient(DatabaseConfig.MONGODB_URL)
    db = client[DatabaseConfig.DATABASE_NAME]
    try:
        # This line forces a connection and will raise an exception if the database is not available
        await db.command("serverStatus")
        logger.info("Successfully connected to MongoDB!")
    except Exception as e:
        logger.error(f"Error: {e}")
        await close_mongo_connection(app)

async def close_mongo_connection(app: FastAPI):
    client.close()
    logger.info("MongoDB connection closed.")
