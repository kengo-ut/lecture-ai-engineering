from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.router import router

app = FastAPI(
    title="Chat API",
    description="API for chat application",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"],
)

app.include_router(router, prefix="/api")
