from sqlalchemy import Column, Integer, String, Float, Boolean, JSON
from app.db.base import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(String, unique=True, index=True)
    name = Column(String)
    generic_name = Column(String)
    brand = Column(String)
    category = Column(String)
    price = Column(Float)
    original_price = Column(Float)
    image = Column(String)
    description = Column(String)
    prescription_required = Column(Boolean, default=False)
    in_stock = Column(Boolean, default=True)
    pack_size = Column(String)
    dosage = Column(String)
    manufacturer = Column(String)
    uses = Column(JSON)
    rating = Column(Float)
    reviews = Column(Integer)
