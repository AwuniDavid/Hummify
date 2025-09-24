# In backend/app/config.py

import os
from typing import Optional, List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # App settings
    app_name: str = "Hummify API"
    debug: bool = True
    version: str = "1.0.0"
    
    # Firebase
    firebase_credentials_path: str = os.getenv("FIREBASE_CREDENTIALS_PATH", "firebase-credentials.json")
    firebase_project_id: str = os.getenv("FIREBASE_PROJECT_ID", "hummify-fb4d")

    # Audio processing
    max_audio_size_mb: int = 10
    supported_audio_formats: List[str] = ["wav", "mp3", "m4a", "ogg"]
    
    # --- NEW: ACRCloud Credentials ---
    # These lines read the keys for the new, better recognition service.
    acrcloud_host: Optional[str] = os.getenv("ACRCLOUD_HOST")
    acrcloud_access_key: Optional[str] = os.getenv("ACRCLOUD_ACCESS_KEY")
    acrcloud_access_secret: Optional[str] = os.getenv("ACRCLOUD_ACCESS_SECRET")
    # ---------------------------------
    
    # CORS
    allowed_origins: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "https://hummify-beta.vercel.app"
    ]
    
    class Config:
        env_file = ".env"

settings = Settings()