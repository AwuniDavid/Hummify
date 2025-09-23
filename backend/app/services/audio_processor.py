import librosa
import numpy as np
import soundfile as sf
from pydub import AudioSegment
from typing import Dict, Any, Optional, Tuple
import tempfile
import os
from ..config import settings

class AudioProcessor:
    def __init__(self):
        self.sample_rate = 22050  # Standard sample rate for audio analysis
        self.max_duration = 30  # Maximum duration in seconds
    
    async def process_audio_file(self, file_path: str) -> Dict[str, Any]:
        """Process uploaded audio file and extract features"""
        try:
            # Load audio file
            audio_data, sr = librosa.load(file_path, sr=self.sample_rate)
            
            # Trim silence
            audio_data, _ = librosa.effects.trim(audio_data, top_db=20)
            
            # Limit duration
            if len(audio_data) > self.max_duration * sr:
                audio_data = audio_data[:self.max_duration * sr]
            
            # Extract features
            features = await self._extract_audio_features(audio_data, sr)
            
            # Get basic info
            duration = len(audio_data) / sr
            
            return {
                "duration": duration,
                "sample_rate": sr,
                "features": features,
                "audio_data": audio_data.tolist(),  # For AI processing
                "success": True
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    async def _extract_audio_features(self, audio_data: np.ndarray, sr: int) -> Dict[str, Any]:
        """Extract audio features for song matching"""
        features = {}
        
        try:
            # Spectral features
            spectral_centroids = librosa.feature.spectral_centroid(y=audio_data, sr=sr)[0]
            features["spectral_centroid_mean"] = float(np.mean(spectral_centroids))
            features["spectral_centroid_std"] = float(np.std(spectral_centroids))
            
            # Tempo and beat
            tempo, beats = librosa.beat.beat_track(y=audio_data, sr=sr)
            features["tempo"] = float(tempo)
            features["beat_count"] = len(beats)
            
            # Chroma features (pitch classes)
            chroma = librosa.feature.chroma_stft(y=audio_data, sr=sr)
            features["chroma_mean"] = chroma.mean(axis=1).tolist()
            features["chroma_std"] = chroma.std(axis=1).tolist()
            
            # MFCC features
            mfccs = librosa.feature.mfcc(y=audio_data, sr=sr, n_mfcc=13)
            features["mfcc_mean"] = mfccs.mean(axis=1).tolist()
            features["mfcc_std"] = mfccs.std(axis=1).tolist()
            
            # Zero crossing rate
            zcr = librosa.feature.zero_crossing_rate(audio_data)[0]
            features["zcr_mean"] = float(np.mean(zcr))
            features["zcr_std"] = float(np.std(zcr))
            
            # Spectral rolloff
            rolloff = librosa.feature.spectral_rolloff(y=audio_data, sr=sr)[0]
            features["spectral_rolloff_mean"] = float(np.mean(rolloff))
            features["spectral_rolloff_std"] = float(np.std(rolloff))
            
            # RMS energy
            rms = librosa.feature.rms(y=audio_data)[0]
            features["rms_mean"] = float(np.mean(rms))
            features["rms_std"] = float(np.std(rms))
            
        except Exception as e:
            print(f"Error extracting features: {e}")
        
        return features
    
    async def apply_remix_effects(
        self, 
        audio_data: np.ndarray, 
        sr: int, 
        effects: Dict[str, Any]
    ) -> Tuple[np.ndarray, int]:
        """Apply remix effects to audio data"""
        try:
            processed_audio = audio_data.copy()
            
            # Pitch shift
            if "pitch" in effects and effects["pitch"] != 0:
                processed_audio = librosa.effects.pitch_shift(
                    processed_audio, 
                    sr=sr, 
                    n_steps=effects["pitch"]
                )
            
            # Time stretch (speed change)
            if "speed" in effects and effects["speed"] != 1.0:
                processed_audio = librosa.effects.time_stretch(
                    processed_audio, 
                    rate=effects["speed"]
                )
            
            # Add reverb (simple implementation)
            if "reverb" in effects and effects["reverb"] > 0:
                processed_audio = await self._add_reverb(processed_audio, sr, effects["reverb"])
            
            # Add echo
            if "echo" in effects and effects["echo"] > 0:
                processed_audio = await self._add_echo(processed_audio, sr, effects["echo"])
            
            return processed_audio, sr
            
        except Exception as e:
            print(f"Error applying effects: {e}")
            return audio_data, sr
    
    async def _add_reverb(self, audio_data: np.ndarray, sr: int, intensity: float) -> np.ndarray:
        """Add simple reverb effect"""
        # Simple reverb using convolution with impulse response
        # This is a basic implementation - you might want to use more sophisticated reverb
        delay_samples = int(0.1 * sr)  # 100ms delay
        decay = 0.3 * (intensity / 100)  # Decay based on intensity
        
        reverb_audio = np.zeros(len(audio_data) + delay_samples)
        reverb_audio[:len(audio_data)] = audio_data
        reverb_audio[delay_samples:] += audio_data * decay
        
        return reverb_audio[:len(audio_data)]
    
    async def _add_echo(self, audio_data: np.ndarray, sr: int, intensity: float) -> np.ndarray:
        """Add echo effect"""
        delay_samples = int(0.3 * sr)  # 300ms delay
        decay = 0.4 * (intensity / 100)  # Decay based on intensity
        
        echo_audio = audio_data.copy()
        if len(audio_data) > delay_samples:
            echo_audio[delay_samples:] += audio_data[:-delay_samples] * decay
        
        return echo_audio
    
    async def convert_to_wav(self, input_path: str, output_path: str) -> bool:
        """Convert audio file to WAV format"""
        try:
            audio = AudioSegment.from_file(input_path)
            audio.export(output_path, format="wav")
            return True
        except Exception as e:
            print(f"Error converting to WAV: {e}")
            return False

audio_processor = AudioProcessor()