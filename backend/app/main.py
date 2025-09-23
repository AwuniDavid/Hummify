# In backend/app/main.py

from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .api import auth, hums

# Initialize FastAPI app
app = FastAPI(
    title=settings.app_name,
    version=settings.version,
    description="Backend API for Hummify - Your Tune Finder",
)

# --- FIX: Mount the static directory to serve uploaded files ---
# This makes the 'static' folder at your project root publicly accessible under the "/static" URL path.
app.mount("/static", StaticFiles(directory="static"), name="static")

# Add CORS middleware to allow requests from your frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers with the correct prefixes
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(hums.router, prefix="/api/hums", tags=["Hums"])


@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": f"Welcome to {settings.app_name}"}


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}