from fastapi import APIRouter, Depends, HTTPException, status
from ..services.firebase_service import firebase_service
from ..auth.middleware import get_current_user
from datetime import datetime

router = APIRouter(prefix="/api/auth", tags=["authentication"])

@router.post("/verify")
async def verify_token(current_user: dict = Depends(get_current_user)):
    """Verify Firebase token and get/create user"""
    
    try:
        # Check if user exists in Firestore
        user_profile = await firebase_service.get_user_profile(current_user["uid"])
        
        if not user_profile:
            # Create new user profile
            user_data = {
                "uid": current_user["uid"],
                "email": current_user["email"],
                "username": current_user.get("name", current_user["email"].split("@")[0]),
                "displayName": current_user.get("name"),
                "bio": "",
                "profilePictureUrl": current_user.get("picture"),
                "totalHums": 0,
                "totalLikesReceived": 0,
                "totalCommentsMade": 0,
                "songsIdentified": 0,
                "isVerified": current_user.get("email_verified", False),
                "createdAt": datetime.utcnow().isoformat(),
                "lastLogin": datetime.utcnow().isoformat()
            }
            
            user_profile = await firebase_service.create_or_update_user(current_user["uid"], user_data)
        else:
            # Update last login
            await firebase_service.create_or_update_user(current_user["uid"], {
                "lastLogin": datetime.utcnow().isoformat()
            })
        
        return {
            "user": user_profile,
            "message": "Token verified successfully"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"User verification failed: {str(e)}"
        )

@router.get("/profile")
async def get_profile(current_user: dict = Depends(get_current_user)):
    """Get current user's profile"""
    
    try:
        user_profile = await firebase_service.get_user_profile(current_user["uid"])
        
        if not user_profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User profile not found"
            )
        
        return {
            "user": {
                "uid": user_profile.get("uid"),
                "email": user_profile.get("email"),
                "username": user_profile.get("username"),
                "displayName": user_profile.get("displayName"),
                "bio": user_profile.get("bio", ""),
                "profilePictureUrl": user_profile.get("profilePictureUrl"),
                "isVerified": user_profile.get("isVerified", False),
                "createdAt": user_profile.get("createdAt")
            },
            "stats": {
                "totalHums": user_profile.get("totalHums", 0),
                "totalLikesReceived": user_profile.get("totalLikesReceived", 0),
                "totalCommentsMade": user_profile.get("totalCommentsMade", 0),
                "songsIdentified": user_profile.get("songsIdentified", 0)
            }
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to load profile: {str(e)}"
        )

@router.put("/profile")
async def update_profile(
    profile_data: dict,
    current_user: dict = Depends(get_current_user)
):
    """Update current user's profile"""
    
    try:
        # Get current profile
        current_profile = await firebase_service.get_user_profile(current_user["uid"])
        
        if not current_profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User profile not found"
            )
        
        # Update allowed fields
        allowed_fields = ["username", "displayName", "bio", "profilePictureUrl"]
        update_data = {}
        
        for field in allowed_fields:
            if field in profile_data:
                update_data[field] = profile_data[field]
        
        if update_data:
            await firebase_service.create_or_update_user(current_user["uid"], update_data)
        
        # Get updated profile
        updated_profile = await firebase_service.get_user_profile(current_user["uid"])
        
        return {
            "user": {
                "uid": updated_profile.get("uid"),
                "username": updated_profile.get("username"),
                "displayName": updated_profile.get("displayName"),
                "bio": updated_profile.get("bio"),
                "profilePictureUrl": updated_profile.get("profilePictureUrl")
            },
            "message": "Profile updated successfully"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Profile update failed: {str(e)}"
        )