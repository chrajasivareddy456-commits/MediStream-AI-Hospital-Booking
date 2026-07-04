from fastapi import APIRouter, HTTPException, Depends, Form
from app.schemas.user import UserCreate, UserLogin
from app.core.database import users_collection
from app.core.security import hash_password, verify_password, create_access_token
from app.core.dependencies import get_current_user
from bson import ObjectId
from fastapi.security import OAuth2PasswordRequestForm
from typing import Optional
from fastapi import Depends, Form

router = APIRouter(prefix="/auth", tags=["Auth"])


# =========================
# REGISTER
# =========================
@router.post("/register")
async def register(user: UserCreate):

    existing = await users_collection.find_one({
        "$or": [
            {"email": user.email},
            {"username": user.username}
        ]
    })

    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    doc = {
        "email": user.email,
        "username": user.username,
        "name": user.username,  # default name
        "hashed_password": hash_password(user.password),
        "avatar": "",
        "bloodType": "N/A",
        "weight": "",
        "height": "",
        "lastCheckup": "Not Available",
        "role": "patient",
        "provider": "local"
    }

    result = await users_collection.insert_one(doc)

    token = create_access_token({
        "user_id": str(result.inserted_id),
        "role": "patient"
    })

    return {
        "access_token": token,
        "user": {
            "id": str(result.inserted_id),
            "email": doc["email"],
            "username": doc["username"],
            "name": doc["name"],
            "avatar": doc["avatar"],
            "bloodType": doc["bloodType"],
            "weight": doc["weight"],
            "height": doc["height"],
            "lastCheckup": doc["lastCheckup"],
            "role": doc["role"],
            "provider": doc["provider"]
        }
    }


# =========================
# LOGIN
# =========================

@router.post("/login")
async def login(data: UserLogin):

    user = await users_collection.find_one({
        "$or": [
            {"email": data.email_or_username},
            {"username": data.email_or_username}
        ],
        "provider": "local"
    })

    if not user or not verify_password(data.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({
        "user_id": str(user["_id"]),
        "role": user["role"]
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": str(user["_id"]),
            "email": user.get("email"),
            "username": user.get("username"),
            "name": user.get("name", user.get("username")),
            "avatar": user.get("avatar", ""),
            "bloodType": user.get("bloodType", "N/A"),
            "weight": user.get("weight", ""),
            "height": user.get("height", ""),
            "lastCheckup": user.get("lastCheckup", "Not Available"),
            "role": user.get("role", "patient"),
            "provider": user.get("provider", "local")
        }
    }


@router.get("/me")
async def get_me(current_user=Depends(get_current_user)):

    user = await users_collection.find_one(
        {"_id": ObjectId(current_user["user_id"])}
    )

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": str(user["_id"]),
        "email": user.get("email"),
        "username": user.get("username"),
        "name": user.get("name"),
        "avatar": user.get("avatar"),
        "bloodType": user.get("bloodType"),
        "weight": user.get("weight"),
        "height": user.get("height"),
        "lastCheckup": user.get("lastCheckup"),
        "role": user.get("role"),
        "provider": user.get("provider")
    }
