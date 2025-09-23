# In backend/app/services/song_matcher.py

import httpx
from typing import Dict, List, Any
import base64
import hmac
import hashlib
import time
import os

from ..config import settings

class SongMatcher:
    def __init__(self):
        self.host = settings.acrcloud_host
        self.access_key = settings.acrcloud_access_key
        self.access_secret = settings.acrcloud_access_secret

    async def match_hum_by_file(self, file_path: str) -> List[Dict[str, Any]]:
        # This part is proven to be working perfectly.
        if not all([self.host, self.access_key, self.access_secret]):
            return []
        requrl = f"https://{self.host}/v1/identify"
        http_method = "POST"
        http_uri = "/v1/identify"
        data_type = "audio"
        signature_version = "1"
        timestamp = time.time()
        string_to_sign = f"{http_method}\n{http_uri}\n{self.access_key}\n{data_type}\n{signature_version}\n{str(timestamp)}"
        sign = base64.b64encode(hmac.new(self.access_secret.encode('ascii'), string_to_sign.encode('ascii'), digestmod=hashlib.sha1).digest()).decode('ascii')

        try:
            with open(file_path, 'rb') as audio_file:
                files = {'sample': (os.path.basename(file_path), audio_file, 'audio/wav')}
                data = {
                    'access_key': self.access_key, 'signature': sign,
                    'signature_version': signature_version, 'timestamp': str(timestamp),
                    'data_type': data_type, 'sample_bytes': str(os.path.getsize(file_path))
                }
                async with httpx.AsyncClient(timeout=30.0) as client:
                    response = await client.post(requrl, data=data, files=files)
            
            response.raise_for_status()
            result = response.json()

            if result.get('status', {}).get('code') == 0:
                metadata = result.get('metadata', {})
                music_results = metadata.get('music', [])
                if music_results:
                    return [self._format_acrcloud_result(match, is_humming_result=False) for match in music_results]
                humming_results = metadata.get('humming', []) 
                if humming_results:
                    return [self._format_acrcloud_result(match, is_humming_result=True) for match in humming_results]
            
            return []
        except Exception as e:
            print(f"ERROR during ACRCloud matching: {e}")
            return []

    def _format_acrcloud_result(self, acr_result: Dict[str, Any], is_humming_result: bool) -> Dict[str, Any]:
        """
        Formats a single ACRCloud result and now extracts streaming links.
        """
        artists = acr_result.get('artists', [])
        artist_names = ", ".join([artist['name'] for artist in artists]) if artists else "Unknown Artist"

        score = acr_result.get('score', 0)
        normalized_confidence = score / 100.0 if not is_humming_result else score

        # --- THIS IS THE NEW LOGIC TO EXTRACT STREAMING LINKS ---
        spotify_url = None
        youtube_url = None
        apple_music_url = None

        external_metadata = acr_result.get('external_metadata', {})
        if external_metadata:
            # Spotify
            spotify_data = external_metadata.get('spotify', {})
            if spotify_data and 'track' in spotify_data and 'id' in spotify_data['track']:
                spotify_id = spotify_data['track']['id']
                spotify_url = f"https://open.spotify.com/track/{spotify_id}"
            
            # YouTube
            youtube_data = external_metadata.get('youtube', {})
            if youtube_data and 'vid' in youtube_data:
                youtube_vid = youtube_data['vid']
                youtube_url = f"https://www.youtube.com/watch?v={youtube_vid}"
            
            # Apple Music (sometimes they provide a direct URL)
            apple_music_data = external_metadata.get('apple_music', {})
            if apple_music_data and 'url' in apple_music_data:
                apple_music_url = apple_music_data['url']
        # --------------------------------------------------------

        return {
            "title": acr_result.get('title', 'Unknown Title'),
            "artist": artist_names,
            "album": acr_result.get('album', {}).get('name', 'Unknown Album'),
            "confidence": normalized_confidence,
            "source": "acrcloud_api",
            # Add the new fields to the response
            "spotify_url": spotify_url,
            "youtube_url": youtube_url,
            "apple_music_url": apple_music_url,
        }

song_matcher = SongMatcher()