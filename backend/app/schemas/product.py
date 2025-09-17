from typing import List, Optional
from pydantic import BaseModel

class ProductBase(BaseModel):
    product_id: str
    name: str
    generic_name: str
    brand: str
    category: str
    price: float
    original_price: float
    image: str
    description: str
    prescription_required: bool
    in_stock: bool
    pack_size: str
    dosage: str
    manufacturer: str
    uses: List[str]
    rating: float
    reviews: int

class Product(ProductBase):
    id: int

    class Config:
        from_attributes = True
