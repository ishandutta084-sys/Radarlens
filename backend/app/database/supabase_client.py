import logging
from typing import Optional
from supabase import create_client, Client
from app.core.config import settings

logger = logging.getLogger(__name__)

supabase: Optional[Client] = None

def get_supabase_client() -> Optional[Client]:
    global supabase
    if supabase is not None:
        return supabase

    url = settings.SUPABASE_URL
    key = settings.SUPABASE_SERVICE_ROLE_KEY or settings.SUPABASE_ANON_KEY

    if url and key and "your-project" not in url:
        try:
            supabase = create_client(url, key)
            logger.info("Successfully connected to Supabase client at %s", url)
            return supabase
        except Exception as e:
            logger.warning("Could not initialize Supabase client: %s. Using local fallback.", e)
            return None
    else:
        logger.info("Supabase credentials not configured in .env. Using robust local fallback.")
        return None
