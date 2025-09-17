from typing import List, Optional
from pydantic import BaseModel

class RemedyBase(BaseModel):
    remedy_id: str
    symptoms: List[str]
    title: str
    description: str
    remedies_list: List[str]
    warning: str
    audio_text: str

class Remedy(RemedyBase):
    id: int

    class Config:
        from_attributes = True
