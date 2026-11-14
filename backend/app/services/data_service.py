import os
import json
import time
import logging
from typing import List, Optional, Dict, Any
from pathlib import Path

from app.database.supabase_client import get_supabase_client
from app.models.schemas import (
    EventSummary,
    EventDetail,
    SourceItem,
    StepItem,
    TeamItem,
    FeedbackCreate,
    FeedbackResponse
)

logger = logging.getLogger(__name__)

# Base directory for local fallback data
DATA_DIR = Path(__file__).resolve().parent.parent.parent / "data"

# In-memory IP rate-limiting cache (matching original server.js behavior: 5 requests per 60s)
feedback_ip_map: Dict[str, List[float]] = {}
RATE_LIMIT_WINDOW_SECONDS = 60.0
MAX_REQUESTS_PER_WINDOW = 5

def is_rate_limited(ip: str) -> bool:
    now = time.time()
    timestamps = feedback_ip_map.get(ip, [])
    recent = [t for t in timestamps if now - t < RATE_LIMIT_WINDOW_SECONDS]
    if len(recent) >= MAX_REQUESTS_PER_WINDOW:
        feedback_ip_map[ip] = recent
        return True
    recent.append(now)
    feedback_ip_map[ip] = recent
    return False

def _read_local_json(filename: str) -> Optional[Any]:
    filepath = DATA_DIR / filename
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        logger.error("Error reading local data file %s: %s", filename, e)
        return None

def _write_local_json(filename: str, data: Any) -> bool:
    filepath = DATA_DIR / filename
    try:
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
        return True
    except Exception as e:
        logger.error("Error writing local data file %s: %s", filename, e)
        return False

class DataService:
    @staticmethod
    def get_events() -> List[EventSummary]:
        client = get_supabase_client()
        if client:
            try:
                res = client.table("events").select("id, title, type, thumb, summary").execute()
                if res.data:
                    return [EventSummary(**row) for row in res.data]
            except Exception as e:
                logger.warning("Supabase events query failed: %s. Falling back to local data.", e)

        local_events = _read_local_json("events.json") or []
        return [
            EventSummary(
                id=e["id"],
                title=e["title"],
                type=e["type"],
                thumb=e.get("thumb"),
                summary=e.get("summary")
            )
            for e in local_events
        ]

    @staticmethod
    def get_event_by_id(event_id: str) -> Optional[EventDetail]:
        target_id = event_id.strip().lower()
        client = get_supabase_client()

        if client:
            try:
                res = client.table("events").select("*").ilike("id", target_id).execute()
                if res.data and len(res.data) > 0:
                    row = res.data[0]
                    # Map Supabase snake_case fields if needed
                    return EventDetail(
                        id=row["id"],
                        title=row["title"],
                        type=row["type"],
                        thumb=row.get("thumb"),
                        summary=row.get("summary"),
                        headline=row.get("headline"),
                        whyMatters=row.get("why_matters") or row.get("whyMatters"),
                        whyRadar=row.get("why_radar") or row.get("whyRadar"),
                        unit=row.get("unit"),
                        before=row.get("before_data") or row.get("before"),
                        after=row.get("after_data") or row.get("after"),
                        radarImage=row.get("radar_image") or row.get("radarImage"),
                        opticalImage=row.get("optical_image") or row.get("opticalImage"),
                        gapDays=row.get("gap_days") or row.get("gapDays"),
                        bbox=row.get("bbox"),
                        credits=row.get("credits")
                    )
            except Exception as e:
                logger.warning("Supabase event detail query failed: %s. Falling back to local data.", e)

        local_events = _read_local_json("events.json") or []
        for e in local_events:
            if e["id"].strip().lower() == target_id:
                return EventDetail(**e)
        return None

    @staticmethod
    def get_sources() -> List[SourceItem]:
        client = get_supabase_client()
        if client:
            try:
                res = client.table("sources").select("dataset, used_for, provider, date_range").execute()
                if res.data:
                    return [
                        SourceItem(
                            dataset=r["dataset"],
                            usedFor=r.get("used_for") or r.get("usedFor", ""),
                            provider=r["provider"],
                            dateRange=r.get("date_range") or r.get("dateRange", "")
                        )
                        for r in res.data
                    ]
            except Exception as e:
                logger.warning("Supabase sources query failed: %s. Falling back to local data.", e)

        local_sources = _read_local_json("sources.json") or []
        return [SourceItem(**s) for s in local_sources]

    @staticmethod
    def get_steps() -> List[StepItem]:
        client = get_supabase_client()
        if client:
            try:
                res = client.table("steps").select("number, title, text").order("number").execute()
                if res.data:
                    return [StepItem(**r) for r in res.data]
            except Exception as e:
                logger.warning("Supabase steps query failed: %s. Falling back to local data.", e)

        local_steps = _read_local_json("steps.json") or []
        return [StepItem(**s) for s in local_steps]

    @staticmethod
    def get_team() -> List[TeamItem]:
        client = get_supabase_client()
        if client:
            try:
                res = client.table("team_members").select("role, name").order("sort_order").execute()
                if res.data:
                    return [TeamItem(**r) for r in res.data]
            except Exception as e:
                logger.warning("Supabase team query failed: %s. Falling back to local data.", e)

        local_team = _read_local_json("team.json") or []
        return [TeamItem(**m) for m in local_team]

    @staticmethod
    def save_feedback(feedback_in: FeedbackCreate, client_ip: str) -> FeedbackResponse:
        import uuid
        from datetime import datetime, timezone

        entry_id = str(uuid.uuid4())[:12]
        created_at = datetime.now(timezone.utc).isoformat()
        trimmed_name = feedback_in.name.strip()
        trimmed_message = feedback_in.message.strip()

        client = get_supabase_client()
        if client:
            try:
                res = client.table("feedback").insert({
                    "id": entry_id,
                    "name": trimmed_name,
                    "message": trimmed_message,
                    "client_ip": client_ip,
                    "created_at": created_at
                }).execute()
                if res.data:
                    return FeedbackResponse(
                        success=True,
                        message="Thank you! Your feedback has been received."
                    )
            except Exception as e:
                logger.warning("Supabase feedback insert failed: %s. Saving to local storage.", e)

        # Fallback to local storage
        feedback_list = _read_local_json("feedback.json") or []
        feedback_list.append({
            "id": entry_id,
            "name": trimmed_name,
            "message": trimmed_message,
            "clientIp": client_ip,
            "createdAt": created_at
        })
        _write_local_json("feedback.json", feedback_list)

        return FeedbackResponse(
            success=True,
            message="Thank you! Your feedback has been received."
        )
