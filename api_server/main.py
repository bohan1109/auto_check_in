from fastapi import FastAPI
from db.connect import connect_to_mongo, close_mongo_connection
from routers import admins as admin_route
from routers import check_in_accounts as check_in_account_route

import logging
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
import time
from utils.process_time import ProcessTimeMiddleware
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
class ProcessTimeMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        
        response = await call_next(request)
        
        process_time = time.time() - start_time
        response.headers["X-Process-Time"] = str(process_time)
        logger.info(f"Processed request in {process_time:.4f} seconds")
        return response
app = FastAPI()
logging.basicConfig(level=logging.INFO)
@app.get("/api")
def read_root():
    return {"Hello": "World"}

app.include_router(admin_route.router, prefix="/api/admins", tags=["admins"])
app.include_router(check_in_account_route.router, prefix="/api/check-in-accounts", tags=["check-in-accounts"])

app.add_middleware(ProcessTimeMiddleware)

@app.on_event("startup")
async def startup_event():
    await connect_to_mongo(app)

@app.on_event("shutdown")
async def shutdown_event():
    await close_mongo_connection(app)
