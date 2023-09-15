from fastapi import FastAPI
from db.connect import connect_to_mongo, close_mongo_connection

app = FastAPI()

@app.on_event("startup")
async def startup_event():
    await connect_to_mongo(app)

@app.on_event("shutdown")
async def shutdown_event():
    await close_mongo_connection(app)

@app.get("/")
def read_root() -> dict[str, str]:
    return {"Hello": "World"}
