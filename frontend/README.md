# Hummify - Your Tune Finder

A modern web application that allows users to hum songs, identify them using AI, create remixes, and share with a social community. Built with React.js frontend, Firebase for real-time features, and FastAPI backend for AI processing.

## Features

- 🎵 **Audio Recording**: Record hums with real-time waveform visualization
- 🔍 **Song Identification**: Dual-mode AI-powered song matching (Firebase + FastAPI backend)
- 🎛️ **Audio Remixing**: Advanced audio processing with pitch, speed, echo, and reverb controls
- 📱 **Social Feed**: Share hums, like, and comment on community posts
- 👤 **User Profiles**: Personal dashboards with statistics and hum history
- 🔐 **Firebase Authentication**: Secure user authentication and data storage
- 🤖 **AI Backend Integration**: Optional FastAPI backend for advanced audio processing
- 📱 **Responsive Design**: Optimized for mobile and desktop

## Tech Stack

- **Frontend**: React.js, Tailwind CSS, Vite, Lucide React
- **Real-time Backend**: Firebase (Authentication, Firestore, Storage)
- **AI Backend**: FastAPI, PostgreSQL, Redis, Celery (optional)
- **Routing**: React Router DOM
- **Audio**: Web Audio API, MediaRecorder API

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Firebase project with Authentication, Firestore, and Storage enabled
- Python 3.11+ (for backend)
- PostgreSQL and Redis (for backend)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd hummify
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment:
```bash
cp .env.example .env
```

4. Configure Firebase:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Enable Storage
   - Update `.env` with your Firebase configuration

5. (Optional) Set up FastAPI Backend:
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Configure backend environment
uvicorn app.main:app --reload
```

6. Start the frontend:
```bash
npm run dev
```

## Architecture

Hummify uses a hybrid architecture:

- **Firebase**: Handles authentication, real-time data, and basic features
- **FastAPI Backend**: Provides advanced AI processing, audio analysis, and enhanced features
- **Automatic Fallback**: If the backend is unavailable, the app gracefully falls back to Firebase-only mode

### Dual-Mode Operation

**Firebase Mode** (Default):
- Basic song matching
- Real-time social features
- Simple audio processing
- Works without backend server

**Enhanced Mode** (With Backend):
- AI-powered song identification
- Advanced audio processing
- Professional remix effects
- Enhanced analytics and recommendations

## Firebase Setup

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Anyone can read hums, but only authenticated users can create
    match /hums/{humId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
      allow delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

### Storage Security Rules

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

## Backend Setup (Optional)

The FastAPI backend provides enhanced AI features. See `backend/README.md` for detailed setup instructions.

### Quick Backend Start

```bash
cd backend
docker-compose up -d  # Start PostgreSQL and Redis
uvicorn app.main:app --reload  # Start FastAPI server
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AudioRecorder.jsx
│   ├── AuthForm.jsx
│   ├── FeedCard.jsx
│   ├── Navbar.jsx
│   ├── ProtectedRoute.jsx
│   └── RemixControls.jsx
├── config/             # Configuration files
│   └── firebase.js
├── config/             # Configuration files
│   └── firebase.js
├── contexts/           # React contexts
│   └── AuthContext.jsx
├── pages/              # Page components
│   ├── Feed.jsx
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Profile.jsx
│   ├── Record.jsx
│   ├── Remix.jsx
│   └── Signup.jsx
├── services/           # API and service functions
│   ├── api.js
│   ├── backendHumService.js
│   ├── firebaseAuthService.js
│   └── firebaseHumService.js
├── App.tsx
├── index.css
└── main.tsx
```

## Features Overview

### Intelligent Mode Selection
- **Auto-Detection**: App automatically detects if backend is available
- **User Choice**: Users can toggle between basic and enhanced modes
- **Graceful Fallback**: Seamless fallback to Firebase if backend fails

### Enhanced Audio Processing
- **AI Song Matching**: Advanced algorithms for better accuracy
- **Professional Effects**: High-quality audio processing
- **Real-time Analysis**: Live audio feature extraction

### Social Features
- **Real-time Feed**: Live updates using Firebase
- **Community Interaction**: Likes, comments, and sharing
- **User Profiles**: Comprehensive statistics and history

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

### Frontend (.env)
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Backend API (Optional)
VITE_API_BASE_URL=http://localhost:8000
```

### Backend (backend/.env)
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/hummify

# Firebase Admin
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CREDENTIALS_PATH=firebase-credentials.json

# Redis
REDIS_URL=redis://localhost:6379
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.