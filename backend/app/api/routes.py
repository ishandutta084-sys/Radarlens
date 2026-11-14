import logging
from typing import List
from fastapi import APIRouter, Request, HTTPException, status
from app.models.schemas import (
    EventSummary,
    EventDetail,
    SourceItem,
    StepItem,
    TeamItem,
    FeedbackCreate,
    FeedbackResponse
)
from app.services.data_service import DataService, is_rate_limited

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["RadarLens Endpoints"])

@router.get("/events", response_model=List[EventSummary], summary="List all events")
def get_events():
    """Returns summary list of radar change detection events (Flood, Glacier, Wetland)."""
    return DataService.get_events()

@router.get("/events/{event_id}", response_model=EventDetail, summary="Get event details by ID")
def get_event_by_id(event_id: str):
    """Returns comprehensive event dataset including before/after SAR images, bounding boxes, and metrics."""
    event = DataService.get_event_by_id(event_id)
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Event '{event_id}' not found"
        )
    return event

@router.get("/sources", response_model=List[SourceItem], summary="Get data sources and satellites")
def get_sources():
    """Returns documentation and specifications of radar, optical, and NASA GIBS data sources."""
    return DataService.get_sources()

@router.get("/team", response_model=List[TeamItem], summary="Get NASA Space Apps project team")
def get_team():
    """Returns team member names and roles for the RadarLens project."""
    return DataService.get_team()

@router.get("/steps", response_model=List[StepItem], summary="Get 'How SAR Works' steps")
def get_steps():
    """Returns educational steps explaining synthetic aperture radar physics and imaging."""
    return DataService.get_steps()

@router.post(
    "/feedback",
    response_model=FeedbackResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Submit user feedback"
)
def submit_feedback(payload: FeedbackCreate, request: Request):
    """Submits feedback with rate limiting (5 req/min) and persists to Supabase or local storage."""
    client_ip = request.client.host if request.client else "unknown"

    if is_rate_limited(client_ip):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many submissions. Please wait a minute and try again."
        )

    if not payload.name.strip() or not payload.message.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Name and message cannot be empty."
        )

    return DataService.save_feedback(payload, client_ip)
