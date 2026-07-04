from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, google_auth, ai, admin, appointments

app = FastAPI(title="MediStream Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(google_auth.router)
app.include_router(ai.router)
app.include_router(admin.router)
app.include_router(appointments.router)

@app.get("/health")
async def health():
    return {"status": "ok"}
