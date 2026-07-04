from fastapi import APIRouter, Depends
from app.core.database import appointments_collection
from app.core.dependencies import get_current_user
from bson import ObjectId

router = APIRouter(prefix="/appointments", tags=["Appointments"])


# create appointment
@router.post("/")
async def create_appointment(data: dict, user=Depends(get_current_user)):

    doc = {
        "patient_id": user["user_id"],
        "patientName": data["patientName"],
        "department": data["department"],
        "date": data["date"],
        "time": data["time"],
        "urgency": data.get("urgency", "Normal"),
        "status": "Scheduled"
    }

    result = await appointments_collection.insert_one(doc)
    doc["_id"] = str(result.inserted_id)

    return doc


# get current user's appointments
@router.get("/my")
async def get_my_appointments(user=Depends(get_current_user)):

    appts = []
    async for a in appointments_collection.find({"patient_id": user["user_id"]}):
        a["_id"] = str(a["_id"])
        appts.append(a)

    return appts