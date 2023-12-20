import asyncio
import logging
from datetime import datetime, timedelta
import random
from motor.motor_asyncio import AsyncIOMotorClient
from config import DatabaseConfig

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger()

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

def generate_random_time(start, end, interval):
    start_time = datetime.strptime(start, "%H:%M")
    end_time = datetime.strptime(end, "%H:%M")
    interval = timedelta(minutes=interval)

    times = []
    current_time = start_time
    while current_time <= end_time:
        times.append(current_time.strftime("%H:%M"))
        current_time += interval

    return random.choice(times)

async def update_random_times():
    collection = db.check_in_accounts
    random_check_in_accounts = await collection.find({"use_random_check_in": True}).to_list(None)

    for account in random_check_in_accounts:
        random_check_in_time = generate_random_time("08:30", "09:00", 5)
        random_check_out_time = generate_random_time("18:00", "18:25", 5)

        await collection.update_one(
            {"_id": account['_id']},
            {"$set": {
                "check_in_time": random_check_in_time,
                "check_out_time": random_check_out_time
            }}
        )
    logger.info(f"Updated {len(random_check_in_accounts)} documents.")

async def main():
    logger.info("Script started!")
    await connect_to_mongo()
    await update_random_times()
    await close_mongo_connection()
    logger.info("Script finished successfully!")

if __name__ == "__main__":
    asyncio.run(main())
