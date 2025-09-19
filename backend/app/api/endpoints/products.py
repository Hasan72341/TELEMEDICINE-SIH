from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas
from app.api import deps

router = APIRouter()

@router.get("/", response_model=List[schemas.Product])
def read_products(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
):
    products = db.query(models.Product).offset(skip).limit(limit).all()
    return products

@router.post("/", response_model=schemas.Product)
def create_product(
    *,
    db: Session = Depends(deps.get_db),
    product_in: schemas.ProductBase,
    current_user: models.User = Depends(deps.get_current_doctor),
):
    product = models.Product(**product_in.dict())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product
