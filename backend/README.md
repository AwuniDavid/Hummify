# Hummify Backend API

A FastAPI-based backend for Hummify that handles audio processing, song matching, and social features with Firebase authentication integration.

## 🚀 Features

- **Firebase Authentication**: Secure user authentication with Firebase Admin SDK
- **Audio Processing**: Advanced audio analysis using librosa
- **Song Matching**: AI-powered song identification with fallback algorithms
- **Social Features**: Likes, comments, and user feeds
- **Real-time Processing**: Asynchronous audio processing with Celery
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Caching**: Redis for performance optimization

## 🏗️ Architecture

```
Backend/
├── app/
│   ├── api/              # API endpoints
│   ├── auth/             # Firebase authentication
│   ├── models/           # Database models
│   ├── services/         # Business logic
│   └── utils/            # Utilities
├── requirements.txt      # Python dependencies
├── Dockerfile           # Container configuration
└── docker-compose.yml  # Multi-service setup
```

## 🛠️ Setup

### Prerequisites

- Python 3.11+
- PostgreSQL 15+
- Redis 7+
- Firebase project with Admin SDK

### Local Development

1. **Clone and setup**:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

2. **Environment Configuration**:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Firebase Setup**:
   - Download Firebase Admin SDK credentials
   - Save as `firebase-credentials.json` in the backend directory
   - Update `FIREBASE_PROJECT_ID` in `.env`

4. **Database Setup**:
```bash
# Start PostgreSQL and Redis
docker-compose up postgres redis -d

# The app will automatically create tables on startup
```

5. **Run the application**:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Docker Deployment

```bash
# Build and run all services
docker-compose up --build

# Run in background
docker-compose up -d
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/verify` - Verify Firebase token
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Hums
- `POST /api/hums/upload` - Upload audio file
- `POST /api/hums/match/{hum_id}` - Match hum to songs
- `POST /api/hums/remix/{hum_id}` - Create remix
- `GET /api/hums/feed` - Get public feed
- `POST /api/hums/like/{hum_id}` - Like/unlike hum
- `POST /api/hums/comment/{hum_id}` - Add comment
- `GET /api/hums/user/{user_id}` - Get user's hums

### System
- `GET /` - API information
- `GET /health` - Health check
- `GET /docs` - API documentation (development only)

## 🔧 Configuration

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/hummify

# Redis
REDIS_URL=redis://localhost:6379

# Firebase
FIREBASE_CREDENTIALS_PATH=firebase-credentials.json
FIREBASE_PROJECT_ID=your-project-id

# AI Model (Optional)
AI_MODEL_ENDPOINT=https://your-ai-endpoint.com
AI_MODEL_API_KEY=your-api-key

# App Settings
DEBUG=true
```

### Firebase Admin SDK Setup

1. Go to Firebase Console → Project Settings → Service Accounts
2. Generate new private key
3. Download JSON file as `firebase-credentials.json`
4. Place in backend root directory

## 🎵 Audio Processing

The backend supports:

- **Formats**: WAV, MP3, M4A, OGG
- **Max Size**: 10MB per file
- **Features**: Tempo, spectral analysis, MFCC, chroma
- **Effects**: Pitch shift, speed change, reverb, echo

## 🤖 AI Integration

### Song Matching Pipeline

1. **Audio Feature Extraction**: Extract musical features using librosa
2. **AI Model Query**: Send features to external AI service (optional)
3. **Fallback Matching**: Use feature similarity if AI unavailable
4. **Result Storage**: Cache results in database

### Adding Your AI Model

```python
# In song_matcher.py
async def _match_with_ai_model(self, audio_features):
    # Your AI model integration here
    response = await your_ai_service.predict(audio_features)
    return self._format_ai_results(response)
```

## 📊 Database Schema

### Users
- Firebase UID integration
- Profile information
- Usage statistics

### Hums
- Audio metadata
- Processing status
- Match results
- Social metrics

### Songs
- Song metadata
- Audio features
- External service IDs

## 🔒 Security

- **Authentication**: Firebase token verification
- **Authorization**: User-based access control
- **File Validation**: Audio format and size limits
- **CORS**: Configurable origins
- **Rate Limiting**: Built-in FastAPI protection

## 🚀 Deployment

### Production Checklist

- [ ] Set `DEBUG=false`
- [ ] Configure production database
- [ ] Set up Redis cluster
- [ ] Add domain to CORS origins
- [ ] Configure Firebase production credentials
- [ ] Set up monitoring and logging
- [ ] Configure reverse proxy (nginx)
- [ ] Set up SSL certificates

### Scaling Considerations

- **Horizontal Scaling**: Multiple API instances behind load balancer
- **Database**: Read replicas for heavy read workloads
- **File Storage**: Use cloud storage (AWS S3, Google Cloud Storage)
- **Caching**: Redis cluster for high availability
- **Background Jobs**: Multiple Celery workers

## 🧪 Testing

```bash
# Run tests
pytest

# With coverage
pytest --cov=app

# Integration tests
pytest tests/integration/
```

## 📈 Monitoring

- **Health Checks**: `/health` endpoint
- **Metrics**: Built-in FastAPI metrics
- **Logging**: Structured logging with correlation IDs
- **Error Tracking**: Integration ready for Sentry

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Add tests for new features
4. Ensure all tests pass
5. Submit pull request

## 📄 License

MIT License - see LICENSE file for details.