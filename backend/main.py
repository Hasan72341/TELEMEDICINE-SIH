from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.api import api_router
from app.db.init_db import init_db
from app.db.base_models import Base
from app.db.session import SessionLocal

app = FastAPI(title=settings.PROJECT_NAME, openapi_url=f"{settings.API_V1_STR}/openapi.json")

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.on_event("startup")
def startup_event():
    import time
    from sqlalchemy import text
    
    retries = 10
    while retries > 0:
        try:
            db = SessionLocal()
            db.execute(text("SELECT 1"))
            init_db(db)
            print("Database initialized successfully.")
            break
        except Exception as e:
            print(f"Database not ready yet... ({retries} retries left): {str(e)}")
            retries -= 1
            time.sleep(5)
        finally:
            if 'db' in locals() and db:
                db.close()

@app.get("/health")
def health_check():
    return {"status": "healthy"}
