from fastapi import FastAPI
from db.connect import connect_to_mongo, close_mongo_connection
from routers import admins as admin_route

app = FastAPI()

app.include_router(admin_route.router, prefix="/admins", tags=["admins"])

@app.on_event("startup")
async def startup_event():
    await connect_to_mongo(app)

@app.on_event("shutdown")
async def shutdown_event():
    await close_mongo_connection(app)
