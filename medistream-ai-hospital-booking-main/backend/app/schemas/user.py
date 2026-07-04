from pydantic import BaseModel, EmailStr
from typing import Optional, Literal


class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str


class UserLogin(BaseModel):
    email_or_username: str
    password: str


class UserPublic(BaseModel):
    id: str
    email: EmailStr
    username: str
    name: str
    avatar: Optional[str] = ""
    bloodType: Optional[str] = "N/A"
    weight: Optional[str] = ""
    height: Optional[str] = ""
    lastCheckup: Optional[str] = "Not Available"

    role: Literal["patient", "admin"] = "patient"

    provider: str


class GoogleUser(BaseModel):
    email: EmailStr
    name: Optional[str]
    google_id: str