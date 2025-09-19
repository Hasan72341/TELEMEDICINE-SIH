from fastapi import APIRouter, Query, HTTPException, Depends
from pydantic import BaseModel
from openai import OpenAI
import json
from app.core.config import settings
from app.api import deps
from app import models

router = APIRouter()

class LanguageInfo(BaseModel):
    name: str
    code: str
    confidence: float

class HomeRemedies(BaseModel):
    symptom: str
    remedy: str
    description: str
    language: LanguageInfo

client = OpenAI(
    api_key=settings.OLLAMA_API_KEY,
    base_url=settings.OLLAMA_BASE_URL
)

@router.post("/remedy", response_model=HomeRemedies)
async def get_remedy(
    symptom: str = Query(..., description="User symptom text"),
    lang: str = Query("en", enum=["en", "hi", "pa"], description="Response language: en, hi, pa"),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    
    lang_map = {"en": "English", "hi": "Hindi", "pa": "Punjabi"}
    lang_name = lang_map[lang]

    messages = [
        {
            "role": "system",
            "content": (
                f"You are a helpful elder who always gives home remedies for symptoms "
                f"in structured JSON format. Respond ONLY in {lang_name} ({lang}). "
                f"Provide fields: symptom, remedy, description. Also include a 'language' "
                f"object with name, code, and confidence."
            )
        },
        {"role": "user", "content": symptom}
    ]

    try:
        response = client.chat.completions.create(
            model=settings.OLLAMA_MODEL,
            messages=messages,
            response_format={
                "type": "json_schema",
                "json_schema": {
                    "name": "HomeRemedies",
                    "schema": HomeRemedies.model_json_schema()
                }
            },
            stream=False
        )
        data = json.loads(response.choices[0].message.content)
        return HomeRemedies(**data)
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"AI Service unavailable: {str(e)}")