from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
import json

# ---------------------
# Pydantic models
# --------------------- 


class LanguageInfo(BaseModel):
    name: str
    code: str
    confidence: float

class HomeRemedies(BaseModel):
    symptom: str
    remedy: str
    description: str
    language: LanguageInfo

# ---------------------
# Init OpenAI (Ollama backend)
# ---------------------
client = OpenAI(
    api_key="ollama",
    base_url="http://localhost:11434/v1"
)

# ---------------------
# FastAPI app
# ---------------------
app = FastAPI(
    title="Home Remedies API",
    description="Get home remedies in English, Hindi, or Punjabi.",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# ---------------------
# Endpoint
# ---------------------
@app.post("/remedy", response_model=HomeRemedies)
async def get_remedy(symptom: str = Query(..., description="User symptom text"),
                     lang: str = Query("en", enum=["en", "hi", "pa"], description="Response language: en, hi, pa")):
    """
    Generate home remedy advice in the requested language (English, Hindi, Punjabi).
    """

    # Map language codes to names


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

    # Call Ollama (Qwen)
    response = client.chat.completions.create(
        model="qwen3:4b",  # adjust model as needed
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


