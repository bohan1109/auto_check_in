from fastapi import FastAPI
from db.connect import connect_to_mongo, close_mongo_connection
from routers import admins as admin_route
from routers import check_in_accounts as check_in_account_route

import logging
app = FastAPI()
logging.basicConfig(level=logging.INFO)
@app.get("/")
def read_root():
    return {"Hello": "World"}

app.include_router(admin_route.router, prefix="/admins", tags=["admins"])
app.include_router(check_in_account_route.router, prefix="/check-in-accounts", tags=["check-in-accounts"])

@app.on_event("startup")
async def startup_event():
    await connect_to_mongo(app)

@app.on_event("shutdown")
async def shutdown_event():
    await close_mongo_connection(app)
