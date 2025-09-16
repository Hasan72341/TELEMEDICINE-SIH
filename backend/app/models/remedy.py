from sqlalchemy import Column, Integer, String, JSON
from app.db.base import Base

class Remedy(Base):
    __tablename__ = "remedies"

    id = Column(Integer, primary_key=True, index=True)
    remedy_id = Column(String, unique=True, index=True)
    symptoms = Column(JSON) # List of symptoms
    title = Column(String)
    description = Column(String)
    remedies_list = Column(JSON) # List of remedy steps
    warning = Column(String)
    audio_text = Column(String)
