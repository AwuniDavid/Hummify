# In backend/app/api/hums.py

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Request
import os
import uuid
from datetime import datetime
from pydub import AudioSegment
import io

# Import your services and middleware
from ..services.firebase_service import firebase_service
from ..services.song_matcher import song_matcher
from ..auth.middleware import get_current_user
from ..config import settings

# This line tells pydub exactly where your ffmpeg.exe file is located.
# Ensure this path is correct for your system.
AudioSegment.converter = "C:\\Users\\123456\\Downloads\\Compressed\\ffmpeg-master-latest-win64-gpl-shared\\bin\\ffmpeg.exe"

router = APIRouter()

@router.post("/upload-and-match")
async def upload_and_match_hum(
    title: str = Form(...),
    audio_file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """
    This is your complete, working song identification endpoint.
    It converts the audio, gets matches from ACRCloud, and saves the result.
    """
    content = await audio_file.read()
    file_location = None
    
    try:
        # Convert audio to a standard WAV format for accurate matching
        sound = AudioSegment.from_file(io.BytesIO(content))
        sound = sound.set_channels(1).set_frame_rate(44100).set_sample_width(2)
        
        unique_filename = f"{uuid.uuid4()}.wav"
        file_location = f"static/uploads/{unique_filename}"
        os.makedirs("static/uploads", exist_ok=True)
        sound.export(file_location, format="wav")
        
        # Get matches from ACRCloud using the local file
        matches = await song_matcher.match_hum_by_file(file_location)
        
        best_match = matches[0] if matches else None
        
        # Ensure user profile exists before updating stats
        user_profile = await firebase_service.get_user_profile(current_user["uid"])
        if not user_profile:
            await firebase_service.create_or_update_user(current_user["uid"], {
                "email": current_user.get("email"), "name": current_user.get("name")
            })

        # Save hum data to Firestore
        hum_data = {
            "userId": current_user["uid"], "username": current_user.get("name", "Anonymous"),
            "title": title, "audioUrl": "", "fileSize": os.path.getsize(file_location),
            "audioFormat": "wav", "processingStatus": "completed" if best_match else "no_match",
            "isPublic": True, "likes": 0, "likedBy": [], "commentsCount": 0,
            "matchedSong": best_match, "matchConfidence": best_match['confidence'] if best_match else 0,
            "createdAt": datetime.utcnow().isoformat()
        }
        hum_id = await firebase_service.create_hum(hum_data)
        
        # Update user stats
        await firebase_service.increment_user_stat(current_user["uid"], "totalHums")
        if best_match:
            await firebase_service.increment_user_stat(current_user["uid"], "songsIdentified")

        return {
            "hum_id": hum_id, "title": title, "matches": matches,
            "processing_status": "completed" if best_match else "no_match",
        }
    except Exception as e:
        print(f"ERROR in /upload-and-match: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Clean up the temporary file
        if file_location and os.path.exists(file_location):
            os.remove(file_location)


@router.post("/remix")
async def remix_hum_endpoint(
    request: Request,
    audio_file: UploadFile = File(...),
    pitch: int = Form(0),
    speed: float = Form(1.0),
    reverse: str = Form("false"),
    echo: int = Form(0),
    reverb: int = Form(0)
):
    """
    This is your complete, working remix endpoint.
    It uses a stable method for speed changes to prevent crashes.
    """
    content = await audio_file.read()
    remixed_file_location = None
    
    try:
        print(f"--- REMIXING AUDIO ---")
        sound = AudioSegment.from_file(io.BytesIO(content))

        # --- APPLY THE REMIX EFFECTS ---
        
        if pitch != 0:
            new_frame_rate = int(sound.frame_rate * (2.0 ** (pitch / 12.0)))
            sound = sound._spawn(sound.raw_data, overrides={'frame_rate': new_frame_rate})

        # This is the new, stable method for changing speed
        if speed != 1.0:
            if speed <= 0:
                raise ValueError("Speed must be a positive number.")
            sound = sound.set_frame_rate(int(sound.frame_rate * speed))

        if reverse.lower() == "true":
            sound = sound.reverse()

        if echo > 0:
            decay = 1 - (echo / 100 * 0.7)
            echo_sound = sound - (sound.max_dB * decay)
            delayed_echo = AudioSegment.silent(duration=150) + echo_sound
            sound = sound.overlay(delayed_echo)
            
        if reverb > 0:
             sound = sound + (reverb / 20)

        # --- SAVE AND RETURN THE NEW FILE ---
        unique_filename = f"remix_{uuid.uuid4()}.mp3"
        remixed_file_location = f"static/uploads/{unique_filename}"
        os.makedirs("static/uploads", exist_ok=True)
        
        sound.export(remixed_file_location, format="mp3")

        base_url = str(request.base_url)
        remixed_url = f"{base_url}static/uploads/{unique_filename}"
        
        return { "message": "Remix successful!", "remixed_url": remixed_url }

    except Exception as e:
        print(f"ERROR during remixing: {e}")
        raise HTTPException(status_code=500, detail=str(e))