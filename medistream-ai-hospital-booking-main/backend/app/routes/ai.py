from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from google import genai
from app.core.config import GEMINI_API_KEY

router = APIRouter(prefix="/api", tags=["AI"])

client = genai.Client(api_key=GEMINI_API_KEY)


class AnalyzeRequest(BaseModel):
    symptoms: str


@router.post("/analyze")
async def analyze(data: AnalyzeRequest):
    try:
        prompt = f"""
        You are a hospital triage AI assistant.

        Your task is to classify patient symptoms into an appropriate medical department and urgency level.

        Urgency levels follow hospital triage standards:

        Emergency:
        Life-threatening symptoms that require immediate care.
        Examples include:
        - chest pain
        - severe breathing difficulty
        - stroke symptoms
        - unconsciousness
        - severe bleeding

        Priority:
        Symptoms that are concerning but not immediately life threatening.
        Examples include:
        - high fever
        - persistent vomiting
        - severe abdominal pain
        - infection symptoms
        - worsening illness

        Normal:
        Mild or routine symptoms that are stable.
        Examples include:
        - mild fever
        - headache
        - minor cold symptoms
        - mild pain

        Analyze the symptoms and return ONLY valid JSON.

        Return strictly this structure:

        {{
        "suggestedDepartment": "string",
        "urgency": "Emergency | Priority | Normal",
        "reasoning": "short explanation"
        }}

        Symptoms:
        {data.symptoms}
        """


        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )


        return {
            "result": response.text
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
