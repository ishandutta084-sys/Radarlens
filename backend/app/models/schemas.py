from typing import List, Optional
from pydantic import BaseModel, Field

class EventSummary(BaseModel):
    id: str
    title: str
    type: str
    thumb: Optional[str] = None
    summary: Optional[str] = None

class EventStateData(BaseModel):
    image: str
    date: str
    value: float

class EventCredit(BaseModel):
    role: str
    title: str
    satellite: str
    author: str
    sourceUrl: str
    license: str

class EventDetail(BaseModel):
    id: str
    title: str
    type: str
    thumb: Optional[str] = None
    summary: Optional[str] = None
    headline: Optional[str] = None
    whyMatters: Optional[str] = None
    whyRadar: Optional[str] = None
    unit: Optional[str] = None
    before: EventStateData
    after: EventStateData
    radarImage: Optional[str] = None
    opticalImage: Optional[str] = None
    gapDays: Optional[int] = None
    bbox: Optional[List[float]] = None
    credits: Optional[List[EventCredit]] = None

class SourceItem(BaseModel):
    dataset: str
    usedFor: str
    provider: str
    dateRange: str

class StepItem(BaseModel):
    number: int
    title: str
    text: str

class TeamItem(BaseModel):
    role: str
    name: str

class FeedbackCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, description="Name of the person submitting feedback")
    message: str = Field(..., min_length=1, max_length=1000, description="Feedback message content")

class FeedbackResponse(BaseModel):
    success: bool = True
    message: str

class HealthResponse(BaseModel):
    status: str = "ok"
    database: str
    service: str = "RadarLens FastAPI"
