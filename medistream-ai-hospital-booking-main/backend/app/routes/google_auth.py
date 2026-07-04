from fastapi import APIRouter, HTTPException
from google.oauth2 import id_token
from google.auth.transport import requests

from app.core.database import users_collection
from app.core.security import create_access_token
from app.core.config import GOOGLE_CLIENT_ID
from app.schemas.auth import GoogleLogin

router = APIRouter(prefix="/auth/google", tags=["Auth"])


@router.post("/login")
async def google_login(data: GoogleLogin):
    try:
        idinfo = id_token.verify_oauth2_token(
            data.token,
            requests.Request(),
            audience=GOOGLE_CLIENT_ID
        )
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid Google token")

    email = idinfo["email"]
    google_id = idinfo["sub"]
    name = idinfo.get("name")

    user = await users_collection.find_one({
        "email": email,
        "provider": "google"
    })

    if not user:
        user = {
            "email": email,
            "username": email.split("@")[0],
            "google_id": google_id,
            "name": name,
            "role": "patient",
            "provider":"google"
        }
        result = await users_collection.insert_one(user)
        user["_id"] = result.inserted_id

    token = create_access_token({
        "user_id": str(user["_id"]),
        "role": user["role"]
    })

    return {
        "access_token": token,
        "user": {
            "id": str(user["_id"]),
            "email": user["email"],
            "username": user["username"],
            "role": user["role"],
            "provider": "google"
        }
    }
