from fastapi import APIRouter

from app.api.endpoints import doctors, products, remedies, users, ai, appointments, health_records

api_router = APIRouter()
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(doctors.router, prefix="/doctors", tags=["doctors"])
api_router.include_router(products.router, prefix="/shop", tags=["shop"])
api_router.include_router(remedies.router, prefix="/remedies", tags=["remedies"])
api_router.include_router(appointments.router, prefix="/appointments", tags=["appointments"])
api_router.include_router(health_records.router, prefix="/health-records", tags=["health-records"])
api_router.include_router(ai.router, prefix="/ai", tags=["ai"])
