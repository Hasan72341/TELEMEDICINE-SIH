from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
import json
import os
from typing import List
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# ---------------------
# Configuration
# ---------------------
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", 8006))
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434/v1")
OLLAMA_API_KEY = os.getenv("OLLAMA_API_KEY", "ollama")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "qwen3:4b")
DEBUG = os.getenv("DEBUG", "true").lower() == "true"

# Parse CORS origins
cors_origins_str = os.getenv("CORS_ORIGINS", '["*"]')
try:
    CORS_ORIGINS = json.loads(cors_origins_str)
except json.JSONDecodeError:
    CORS_ORIGINS = ["*"]  # Fallback

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
    api_key=OLLAMA_API_KEY,
    base_url=OLLAMA_BASE_URL
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
    allow_origins=CORS_ORIGINS,  # Use environment configuration
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],  # More specific methods
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
        model=OLLAMA_MODEL,  # Use environment variable
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


# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint for deployment monitoring"""
    return {
        "status": "healthy",
        "model": OLLAMA_MODEL,
        "version": "1.0.0"
    }


# Run the server
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=HOST,
        port=PORT,
        reload=DEBUG
    )