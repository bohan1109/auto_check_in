import models
from services.check_in_accounts import CheckInAccountService
from utils.check_in_crawlers import CheckInCrawler

from motor.motor_asyncio import AsyncIOMotorClient
from config import DatabaseConfig
import asyncio
import logging

# 设置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger()

# 创建 MongoDB 客户端
client = AsyncIOMotorClient(DatabaseConfig.MONGODB_URL)
db = client[DatabaseConfig.DATABASE_NAME]
async def connect_to_mongo():
    logger.info("Attempting to connect to MongoDB...")
    try:
        await db.command("serverStatus")
        logger.info("Successfully connected to MongoDB!")
    except Exception as e:
        logger.error(f"Error connecting to MongoDB: {e}")
        await close_mongo_connection()

async def close_mongo_connection():
    client.close()
    logger.info("MongoDB connection closed.")

async def main():
    logger.info("Script started!")
    await connect_to_mongo()

    check_in_crawler = CheckInCrawler()
    collection = db.check_in_accounts
    logger.info("Fetching check-in accounts...")
    check_in_accounts = await collection.find().to_list(length=1000)
    logger.info(f"Found {len(check_in_accounts)} check-in accounts.")
    
    for idx, check_in_account in enumerate(check_in_accounts):
        logger.info(f"Processing account {idx+1}...")
        check_in_crawler.check_in(check_in_account)
    
    await close_mongo_connection()
    logger.info("Script finished successfully!")

if __name__ == "__main__":
    asyncio.run(main())
