import logging
from contextlib import asynccontextmanager
from pathlib import Path
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.exceptions import RequestValidationError

from app.core.config import settings
from app.api.routes import router as api_router
from app.models.schemas import HealthResponse
from app.database.supabase_client import get_supabase_client

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("radarlens")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("RadarLens FastAPI server starting up...")
    client = get_supabase_client()
    if client:
        logger.info("Supabase database connection initialized.")
    else:
        logger.info("Running with robust local fallback data store.")
    yield
    logger.info("RadarLens FastAPI server shutting down...")

app = FastAPI(
    title="RadarLens - NASA Space Apps NISAR API",
    description="Backend API for RadarLens: interactive synthetic aperture radar change viewer and lunar analogue analysis.",
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception Handlers
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.warning("Validation error on %s: %s", request.url.path, exc)
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"error": "Invalid request payload", "details": exc.errors()}
    )

@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logger.error("Unhandled error on %s: %s", request.url.path, exc, exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"error": "An internal server error occurred."}
    )

# Health endpoint
@app.get("/health", response_model=HealthResponse, tags=["Health"])
def health_check():
    client = get_supabase_client()
    db_status = "connected (Supabase)" if client else "fallback (Local Data Layer)"
    return HealthResponse(
        status="ok",
        database=db_status,
        service="RadarLens FastAPI"
    )

# Include API Router
app.include_router(api_router)

# Serve images for direct static referencing if accessed through backend port
images_dir = Path(__file__).resolve().parent.parent.parent / "public" / "images"
if images_dir.exists():
    app.mount("/images", StaticFiles(directory=str(images_dir)), name="images")
