# In backend/app/services/firebase_service.py

import firebase_admin
from firebase_admin import credentials, firestore, auth
import os
import json
import asyncio
from typing import Dict, Any, List, Optional
from ..config import settings

class FirebaseService:
    def __init__(self):
        """
        Initializes the Firebase Admin SDK for Firestore and Authentication.
        """
        if not firebase_admin._apps:
            # Try to get credentials from environment variable first (for Render)
            google_creds_json = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS_JSON")
            
            if google_creds_json:
                # Parse the JSON string from environment variable
                cred_dict = json.loads(google_creds_json)
                cred = credentials.Certificate(cred_dict)
                print("✅ Using Firebase credentials from environment variable")
            elif os.path.exists(settings.firebase_credentials_path):
                # Fallback to local file (for development)
                cred = credentials.Certificate(settings.firebase_credentials_path)
                print("✅ Using Firebase credentials from local file")
            else:
                # Last resort: try default credentials
                cred = credentials.ApplicationDefault()
                print("⚠️ Using default Firebase credentials")
            
            firebase_admin.initialize_app(cred, {
                'projectId': settings.firebase_project_id,
            })
        
        self.db = firestore.client()

    async def verify_token(self, token: str) -> dict:
        """Verify Firebase ID token and return user info"""
        try:
            # Run the blocking call in a separate thread
            decoded_token = await asyncio.to_thread(auth.verify_id_token, token)
            return {
                "uid": decoded_token["uid"],
                "email": decoded_token.get("email"),
                "name": decoded_token.get("name"),
                "picture": decoded_token.get("picture"),
            }
        except Exception as e:
            raise Exception(f"Invalid authentication token: {str(e)}")

    # --- THIS IS THE MISSING FUNCTION THAT IS NOW ADDED BACK ---
    async def get_user_profile(self, uid: str) -> Optional[Dict[str, Any]]:
        """Gets a user profile document from Firestore by user ID."""
        try:
            user_ref = self.db.collection('users').document(uid)
            doc = await asyncio.to_thread(user_ref.get)
            if doc.exists:
                return doc.to_dict()
            return None
        except Exception as e:
            print(f"Error getting user profile for {uid}: {e}")
            return None
    # -----------------------------------------------------------

    async def create_or_update_user(self, uid: str, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Creates or updates a user profile in Firestore."""
        try:
            user_ref = self.db.collection('users').document(uid)
            doc = await asyncio.to_thread(user_ref.get)

            if not doc.exists:
                print(f"User document for {uid} not found. Creating new profile with default stats.")
                user_data['totalHums'] = 0
                user_data['songsIdentified'] = 0
                user_data['totalCommentsMade'] = 0
                user_data['createdAt'] = firestore.SERVER_TIMESTAMP
            
            await asyncio.to_thread(user_ref.set, user_data, merge=True)
            return user_data
        except Exception as e:
            raise Exception(f"Error in create_or_update_user: {str(e)}")

    async def create_hum(self, hum_data: Dict[str, Any]) -> str:
        """Create a new hum document"""
        try:
            _, hum_ref = await asyncio.to_thread(self.db.collection('hums').add, hum_data)
            return hum_ref.id
        except Exception as e:
            raise Exception(f"Error creating hum: {str(e)}")
    
    async def increment_user_stat(self, uid: str, stat_name: str, increment: int = 1):
        """Increment user statistics."""
        try:
            user_ref = self.db.collection('users').document(uid)
            await asyncio.to_thread(user_ref.update, {stat_name: firestore.Increment(increment)})
        except Exception as e:
            print(f"Error incrementing user stat {stat_name} for {uid}: {e}")

# Global Firebase service instance
firebase_service = FirebaseService()