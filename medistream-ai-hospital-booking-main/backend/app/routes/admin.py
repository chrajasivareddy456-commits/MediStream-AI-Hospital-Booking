from fastapi import APIRouter, Depends
from app.core.dependencies import admin_required
from app.core.database import users_collection, appointments_collection

router = APIRouter(prefix="/admin", tags=["Admin"])


# --------------------------
# GET ALL USERS
# --------------------------
@router.get("/users")
async def get_all_users(user=Depends(admin_required)):
    users = []
    async for u in users_collection.find():
        u["_id"] = str(u["_id"])
        users.append(u)

    return users


# --------------------------
# GET ALL ACTIVE APPOINTMENTS
# --------------------------
@router.get("/appointments")
async def get_all_appointments(user=Depends(admin_required)):

    appointments = []

    async for a in appointments_collection.find({"status": "Scheduled"}):
        a["_id"] = str(a["_id"])
        appointments.append(a)

    return appointments