from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routes.participantes import router as participantes_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="TP4 - Participantes API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # puerto de Vite
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(participantes_router)