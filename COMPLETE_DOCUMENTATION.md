# Hummify - Complete Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Frontend Documentation](#frontend-documentation)
6. [Backend Documentation](#backend-documentation)
7. [ML Engine Documentation](#ml-engine-documentation)
8. [API Documentation](#api-documentation)
9. [Database Schema](#database-schema)
10. [Authentication & Security](#authentication--security)
11. [Audio Processing Pipeline](#audio-processing-pipeline)
12. [Deployment Guide](#deployment-guide)
13. [Development Setup](#development-setup)
14. [Configuration](#configuration)
15. [Troubleshooting](#troubleshooting)

---

## Project Overview

**Hummify** is a modern web application that allows users to identify songs by humming or uploading audio files. The application uses AI-powered music recognition, provides social features for sharing and interacting with identified songs, and includes advanced audio remixing capabilities.

### Key Features
- 🎵 **Audio Recording**: Real-time audio recording with waveform visualization
- 🔍 **Song Identification**: AI-powered song matching using ACRCloud API
- 🎛️ **Audio Remixing**: Advanced audio processing with pitch, speed, echo, and reverb controls
- 📱 **Social Feed**: Share hums, like, and comment on community posts
- 👤 **User Profiles**: Personal dashboards with statistics and hum history
- 🔐 **Firebase Authentication**: Secure user authentication and data storage
- 🤖 **Dual-Mode Operation**: Firebase-only mode with optional FastAPI backend enhancement

---

## System Architecture

Hummify uses a **hybrid architecture** that combines Firebase for real-time features with an optional FastAPI backend for advanced AI processing:

```mermaid
graph TB
    subgraph "Frontend (React)"
        A[React App] --> B[AudioRecorder]
        A --> C[AuthContext]
        A --> D[Pages]
        A --> E[Services]
    end
    
    subgraph "Firebase Services"
        F[Authentication]
        G[Firestore Database]
        H[Storage]
    end
    
    subgraph "Backend (FastAPI)"
        I[API Endpoints]
        J[Audio Processing]
        K[Song Matching]
        L[Firebase Service]
    end
    
    subgraph "External Services"
        M[ACRCloud API]
        N[Streaming Services]
    end
    
    A --> F
    A --> G
    A --> H
    A --> I
    I --> J
    I --> K
    I --> L
    K --> M
    K --> N
    L --> G
    L --> H
```

### Dual-Mode Operation

**Firebase Mode (Default)**:
- Basic song matching
- Real-time social features
- Simple audio processing
- Works without backend server

**Enhanced Mode (With Backend)**:
- AI-powered song identification
- Advanced audio processing
- Professional remix effects
- Enhanced analytics and recommendations

---

## Technology Stack

### Frontend
- **React 18.3.1** - UI framework
- **Vite 7.0.5** - Build tool and dev server
- **TypeScript 5.5.3** - Type safety
- **Tailwind CSS 3.4.1** - Styling
- **React Router DOM 7.7.0** - Client-side routing
- **Lucide React 0.344.0** - Icons
- **Axios 1.10.0** - HTTP client

### Backend
- **FastAPI 0.104.1** - Web framework
- **Uvicorn 0.24.0** - ASGI server
- **Firebase Admin SDK 6.2.0** - Firebase integration
- **SQLAlchemy 2.0.23** - ORM
- **PostgreSQL** - Primary database
- **Redis 5.0.1** - Caching
- **Celery 5.3.4** - Background tasks

### Audio Processing
- **librosa 0.10.1** - Audio analysis
- **pydub 0.25.1** - Audio manipulation
- **soundfile 0.12.1** - Audio I/O
- **Web Audio API** - Browser audio processing

### External Services
- **Firebase** - Authentication, database, storage
- **ACRCloud API** - Music recognition
- **Streaming Services** - Spotify, YouTube, Apple Music

---

## Project Structure

```
hummify/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── AudioRecorder.jsx
│   │   │   ├── AuthForm.jsx
│   │   │   ├── FeedCard.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── RemixControls.jsx
│   │   ├── config/          # Configuration files
│   │   │   └── firebase.js
│   │   ├── contexts/        # React contexts
│   │   │   └── AuthContext.jsx
│   │   ├── pages/           # Page components
│   │   │   ├── Feed.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Record.jsx
│   │   │   ├── Remix.jsx
│   │   │   └── Signup.jsx
│   │   ├── services/        # API and service functions
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── backendHumService.js
│   │   │   ├── firebaseAuthService.js
│   │   │   ├── firebaseHumService.js
│   │   │   └── humService.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── tsconfig.json
├── backend/                  # FastAPI backend application
│   ├── app/
│   │   ├── api/             # API endpoints
│   │   │   ├── auth.py
│   │   │   └── hums.py
│   │   ├── auth/            # Authentication middleware
│   │   │   └── middleware.py
│   │   ├── services/        # Business logic
│   │   │   ├── audio_processor.py
│   │   │   ├── firebase_service.py
│   │   │   └── song_matcher.py
│   │   ├── config.py
│   │   └── main.py
│   ├── static/              # Static file storage
│   │   └── uploads/
│   ├── firebase-credentials.json
│   ├── requirements.txt
│   └── README.md
├── ml-engine/               # Machine learning components
│   ├── data/
│   ├── models/
│   ├── utils/
│   │   ├── extract_features.py
│   │   └── matcher.py
│   ├── match.py
│   └── train.py
└── README.md
```

---

## Frontend Documentation

### Core Components

#### AudioRecorder.jsx
The main audio recording component with real-time waveform visualization:

**Features:**
- Real-time audio recording using MediaRecorder API
- Live waveform visualization using Web Audio API
- Audio playback and download functionality
- Responsive design with Tailwind CSS

**Key Methods:**
- `startRecording()` - Initiates audio recording
- `stopRecording()` - Stops recording and creates audio blob
- `visualizeWaveform()` - Real-time frequency analysis
- `playAudio()` / `pauseAudio()` - Audio playback controls

#### AuthContext.jsx
Global authentication state management:

**Features:**
- Firebase authentication integration
- User profile management
- Authentication state persistence
- Protected route handling

**Context Value:**
```javascript
{
  currentUser: User | null,
  signup: (userData) => Promise,
  login: (credentials) => Promise,
  logout: () => Promise,
  isAuthenticated: boolean
}
```

#### ProtectedRoute.jsx
Route protection component that ensures only authenticated users can access certain pages.

### Pages

#### Record.jsx
Main song identification page:

**Features:**
- Audio recording interface
- File upload functionality
- Song matching results display
- Streaming service links (Spotify, YouTube, Apple Music)

**User Flow:**
1. Record audio or upload file
2. Add optional title
3. Submit for identification
4. View results with confidence scores
5. Access streaming service links

#### Remix.jsx
Audio remixing interface with advanced controls for pitch, speed, echo, and reverb effects.

#### Feed.jsx
Social feed displaying community hums with like and comment functionality.

#### Profile.jsx
User profile page showing statistics, hum history, and profile management.

### Services

#### Firebase Services
- `firebaseAuthService.js` - Authentication operations
- `firebaseHumService.js` - Hum data management
- `backendHumService.js` - Backend API integration

#### API Integration
- `api.js` - Axios configuration and interceptors
- `humService.js` - Hum-related API calls

---

## Backend Documentation

### FastAPI Application Structure

#### main.py
Application entry point with:
- FastAPI app initialization
- CORS middleware configuration
- Static file serving
- Router registration

#### config.py
Configuration management using Pydantic Settings:

```python
class Settings(BaseSettings):
    app_name: str = "Hummify API"
    debug: bool = True
    firebase_credentials_path: str
    firebase_project_id: str
    acrcloud_host: Optional[str]
    acrcloud_access_key: Optional[str]
    acrcloud_access_secret: Optional[str]
    max_audio_size_mb: int = 10
    supported_audio_formats: List[str]
```

### API Endpoints

#### Authentication (`/api/auth`)
- `POST /verify` - Verify Firebase token
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile

#### Hums (`/api/hums`)
- `POST /upload-and-match` - Upload audio and identify song
- `POST /remix` - Create audio remix with effects

### Services

#### FirebaseService
Firebase Admin SDK integration for:
- Token verification
- User profile management
- Firestore operations
- Statistics tracking

#### SongMatcher
ACRCloud API integration for music recognition:
- Audio file processing
- API request formatting
- Result parsing and formatting
- Streaming service link extraction

#### AudioProcessor
Audio manipulation using pydub:
- Format conversion
- Effect application (pitch, speed, echo, reverb)
- File optimization

---

## ML Engine Documentation

The ML engine provides machine learning capabilities for enhanced song matching:

### Components

#### extract_features.py
Audio feature extraction using librosa:
- MFCC (Mel-frequency cepstral coefficients)
- Spectral features
- Tempo and rhythm analysis
- Chroma features

#### matcher.py
Machine learning-based song matching:
- Feature comparison algorithms
- Similarity scoring
- Model inference

#### train.py
Model training pipeline for custom song recognition models.

---

## API Documentation

### Authentication Endpoints

#### POST /api/auth/verify
Verify Firebase authentication token.

**Request:**
```json
{
  "token": "firebase_id_token"
}
```

**Response:**
```json
{
  "user": {
    "uid": "user_id",
    "email": "user@example.com",
    "username": "username",
    "displayName": "Display Name"
  },
  "message": "Token verified successfully"
}
```

#### GET /api/auth/profile
Get current user's profile information.

**Response:**
```json
{
  "user": {
    "uid": "user_id",
    "email": "user@example.com",
    "username": "username",
    "displayName": "Display Name",
    "bio": "User bio",
    "profilePictureUrl": "https://...",
    "isVerified": true,
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "stats": {
    "totalHums": 10,
    "totalLikesReceived": 25,
    "totalCommentsMade": 5,
    "songsIdentified": 8
  }
}
```

### Hum Endpoints

#### POST /api/hums/upload-and-match
Upload audio file and identify the song.

**Request:**
- `audio_file`: Audio file (multipart/form-data)
- `title`: Song title (form data)

**Response:**
```json
{
  "hum_id": "hum_id",
  "title": "Song Title",
  "matches": [
    {
      "title": "Song Title",
      "artist": "Artist Name",
      "album": "Album Name",
      "confidence": 0.95,
      "source": "acrcloud_api",
      "spotify_url": "https://open.spotify.com/track/...",
      "youtube_url": "https://www.youtube.com/watch?v=...",
      "apple_music_url": "https://music.apple.com/..."
    }
  ],
  "processing_status": "completed"
}
```

#### POST /api/hums/remix
Create audio remix with effects.

**Request:**
- `audio_file`: Audio file (multipart/form-data)
- `pitch`: Pitch shift in semitones (form data)
- `speed`: Speed multiplier (form data)
- `reverse`: Reverse audio (form data)
- `echo`: Echo intensity 0-100 (form data)
- `reverb`: Reverb intensity 0-100 (form data)

**Response:**
```json
{
  "message": "Remix successful!",
  "remixed_url": "http://localhost:8000/static/uploads/remix_file.mp3"
}
```

---

## Database Schema

### Firebase Firestore Collections

#### users
```javascript
{
  uid: string,                    // Firebase UID
  email: string,                  // User email
  username: string,               // Display username
  displayName: string,            // Full display name
  bio: string,                    // User biography
  profilePictureUrl: string,      // Profile picture URL
  totalHums: number,              // Total hums created
  totalLikesReceived: number,     // Total likes received
  totalCommentsMade: number,      // Total comments made
  songsIdentified: number,        // Songs successfully identified
  isVerified: boolean,            // Account verification status
  createdAt: timestamp,           // Account creation time
  lastLogin: timestamp            // Last login time
}
```

#### hums
```javascript
{
  userId: string,                 // Creator's UID
  username: string,               // Creator's username
  title: string,                  // Hum title
  audioUrl: string,               // Audio file URL
  fileSize: number,               // File size in bytes
  audioFormat: string,            // Audio format (wav, mp3, etc.)
  processingStatus: string,       // Processing status
  isPublic: boolean,              // Public visibility
  likes: number,                  // Total likes
  likedBy: array,                 // Array of user IDs who liked
  commentsCount: number,          // Total comments
  matchedSong: object,            // Song match result
  matchConfidence: number,        // Match confidence score
  createdAt: timestamp            // Creation time
}
```

---

## Authentication & Security

### Firebase Authentication
- **Provider**: Email/Password authentication
- **Token Verification**: Firebase ID tokens verified on backend
- **Session Management**: Automatic token refresh
- **Security Rules**: Firestore and Storage security rules

### Security Rules

#### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /hums/{humId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
      allow delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

#### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /hums/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### CORS Configuration
Backend configured to allow requests from:
- `http://localhost:3000` (development)
- `http://localhost:5173` (Vite dev server)
- Production domain (configurable)

---

## Audio Processing Pipeline

### Recording Process
1. **User Interaction**: User clicks record button
2. **Media Access**: Request microphone permission
3. **Stream Setup**: Create MediaRecorder with audio stream
4. **Real-time Visualization**: Web Audio API for waveform display
5. **Recording Stop**: Generate audio blob
6. **Playback**: Optional audio preview

### Upload & Processing
1. **File Validation**: Check audio format and size
2. **Format Conversion**: Convert to standard WAV format (44.1kHz, mono, 16-bit)
3. **ACRCloud API**: Send audio for identification
4. **Result Processing**: Parse and format match results
5. **Database Storage**: Save hum data to Firestore
6. **Statistics Update**: Update user statistics

### Remix Processing
1. **Audio Loading**: Load audio file with pydub
2. **Effect Application**:
   - **Pitch**: Frame rate adjustment
   - **Speed**: Frame rate modification
   - **Reverse**: Audio reversal
   - **Echo**: Overlay with delayed copy
   - **Reverb**: Volume adjustment
3. **Export**: Save as MP3 format
4. **URL Generation**: Return accessible file URL

---

## Deployment Guide

### Frontend Deployment

#### Vercel (Recommended)
1. Connect GitHub repository to Vercel
2. Configure environment variables:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_API_BASE_URL=https://your-backend-url.com
   ```
3. Deploy automatically on push to main branch

#### Netlify
1. Connect repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Configure environment variables

### Backend Deployment

#### Docker Deployment
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### Railway/Render
1. Connect GitHub repository
2. Configure environment variables
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Environment Variables

#### Frontend (.env)
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_BASE_URL=http://localhost:8000
```

#### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/hummify
REDIS_URL=redis://localhost:6379
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CREDENTIALS_PATH=firebase-credentials.json
ACRCLOUD_HOST=your_acrcloud_host
ACRCLOUD_ACCESS_KEY=your_access_key
ACRCLOUD_ACCESS_SECRET=your_access_secret
DEBUG=true
```

---

## Development Setup

### Prerequisites
- Node.js 16+
- Python 3.11+
- Firebase project
- ACRCloud account (optional)

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Configure environment variables
npm run dev
```

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Configure environment variables
uvicorn app.main:app --reload
```

### Firebase Setup
1. Create Firebase project
2. Enable Authentication (Email/Password)
3. Enable Firestore Database
4. Enable Storage
5. Download service account credentials
6. Configure security rules

### ACRCloud Setup (Optional)
1. Create ACRCloud account
2. Get API credentials
3. Configure environment variables

---

## Configuration

### Firebase Configuration
```javascript
const firebaseConfig = {
  apiKey: "your_api_key",
  authDomain: "your_domain",
  projectId: "your_project_id",
  storageBucket: "your_bucket",
  messagingSenderId: "your_sender_id",
  appId: "your_app_id"
};
```

### Tailwind Configuration
```javascript
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        }
      }
    },
  },
  plugins: [],
}
```

### Vite Configuration
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  }
})
```

---

## Troubleshooting

### Common Issues

#### Audio Recording Not Working
- Check microphone permissions
- Ensure HTTPS in production
- Verify browser compatibility

#### Firebase Authentication Errors
- Verify Firebase configuration
- Check security rules
- Ensure proper environment variables

#### Backend Connection Issues
- Verify CORS configuration
- Check API base URL
- Ensure backend is running

#### ACRCloud API Errors
- Verify API credentials
- Check audio file format
- Ensure file size limits

### Debug Mode
Enable debug mode in backend configuration:
```python
DEBUG = True
```

### Logging
Backend includes comprehensive logging for:
- API requests
- Authentication events
- Audio processing
- Error tracking

### Performance Optimization
- Use Redis for caching
- Implement audio file compression
- Optimize database queries
- Use CDN for static assets

---

## Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Make changes and test
4. Commit: `git commit -m 'Add amazing feature'`
5. Push: `git push origin feature/amazing-feature`
6. Create Pull Request

### Code Standards
- Follow ESLint configuration
- Use TypeScript for type safety
- Write comprehensive tests
- Document new features
- Follow conventional commit messages

### Testing
```bash
# Frontend tests
npm run test

# Backend tests
pytest

# Integration tests
pytest tests/integration/
```

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Support

For support and questions:
- Create an issue on GitHub
- Check the troubleshooting section
- Review the API documentation
- Consult the Firebase documentation

---

*Last updated: January 2024*
