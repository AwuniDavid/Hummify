

# 🎵 HUMMIFY: AI-Powered Song Identification Platform

## PowerPoint Presentation (Markdown)

---

## Slide 1: Title Slide

# HUMMIFY

### AI-Powered Song Identification Platform

**Bachelor of Computer Science Project**

**Presented by:** Awurabena Agyeiwaa Amponsah-Mensah
**Student ID:** 337022
**Supervisor:** Dr. Emmanuel Ahene

Kwame Nkrumah University of Science and Technology
College of Science
Faculty of Physical and Computational Science
Department of Computer Science

📅 September 2025

---

## Slide 2: Problem Statement

# The Challenge

💭 *“I know this song but can’t remember the name!”*

* Common problem: Users hear melodies but can’t identify them
* Existing tools require lyrics, artist names, or song titles
* Lack of effective humming/audio-based recognition
* Market demand: **85% of music listeners** face this issue regularly

---

## Slide 3: Current Limitations

# What Exists Today

* Limited web-based solutions
* Poor accuracy for humming recognition
* No audio remixing features
* Weak or absent social features
* Lack of cross-platform integration

---

## Slide 4: Project Objectives

# What HUMMIFY Aims to Do

🎯 **Main Goal**: Build an AI-powered song recognition system

**Specific Objectives**

* Hybrid architecture (Firebase + FastAPI)
* Real-time recording & visualization
* Achieve >85% recognition accuracy
* Add social features for engagement
* Integrate with Spotify, YouTube, Apple Music

✅ Success Criteria:

* Response time <5s
* 99% uptime
* Cross-platform support

---

## Slide 5: System Architecture

# Hybrid Architecture

```
React Frontend ─── FastAPI Backend ─── Firebase Cloud
   │                     │                   │
Web Audio API ─── ACRCloud API ─── Firestore DB
```

**Key Components**

* React + TypeScript (frontend)
* FastAPI (backend)
* Firebase Firestore (database)
* Web Audio API, librosa, pydub (audio processing)
* ACRCloud (song recognition)

---

## Slide 6: Technology Stack

# Tech Behind HUMMIFY

**Frontend**

* React.js 18.3.1
* TypeScript 5.5.3
* Tailwind CSS 3.4.1
* Vite 7.0.5

**Backend**

* FastAPI 0.104.1
* Firebase 6.2.0

---

## Slide 7: Key Features

# Core Functionalities

🎤 Real-time recording + waveform
🔍 AI-powered song identification
🎛️ Audio remixing tools
📱 Social platform for sharing & discovery

---

## Slide 8: User Interface Design

# Modern & Intuitive

**Principles**

* Simplicity
* Consistency
* Accessibility
* Responsiveness

**Color Palette**

* Purple (#8B5CF6)
* Blue (#3B82F6)
* Green (#10B981)
* Red (#EF4444)

---

## Slide 9: Audio Processing Pipeline

# From Humming to Match

1. 🎙️ Record → MediaRecorder API
2. 📊 Visualize → Web Audio API
3. 🎼 Convert & preprocess audio
4. 🔎 Submit to ACRCloud → Match
5. 🎶 Return results + links

Remixing handled via **pydub** for pitch, speed, echo, reverb.

---

## Slide 10: Database Design

# Firebase Firestore Schema

**Users**

* uid, email, username, stats

**Hums**

* userId, audioUrl, matchedSong, confidence, likes, comments

✅ Rules:

* Users edit own data
* Auth required for writes
* Public read for hums

---

## Slide 11: API Endpoints

# RESTful Design

**Authentication**

* `/auth/verify`, `/auth/profile`

**Hums**

* `/hums/upload-and-match`
* `/hums/remix`
* `/hums/feed`
* `/hums/like/{id}`

**System**

* `/health`, `/docs`

---

## Slide 12: Testing & QA

# Ensuring Quality

✅ Unit Testing → Jest, pytest
✅ Integration → APIs + DB
✅ End-to-End → User workflows
✅ Performance → Load & speed tests
✅ Security → Auth + validation

---

## Slide 13: Results & Performance

# Performance Achievements

🎵 Song Identification: **85% avg. accuracy**
⚡ Response time: <5s
📱 Mobile-friendly, cross-platform
📊 Reliability: **99.2% uptime**

---

## Slide 14: Challenges & Solutions

# Overcoming Obstacles

* **Audio Quality** → preprocessing
* **Real-time Speed** → optimized algorithms
* **Cross-browser Issues** → fallback mechanisms
* **API Limits** → graceful error handling
* **UX Complexity** → simple, intuitive design

---

## Slide 15: Conclusion & Future Work

# Wrapping Up

✅ Built functional AI-powered platform
✅ Social + remix features integrated
✅ Met accuracy & performance goals

**Future Enhancements**

* ML models for offline recognition
* Mobile & desktop native apps
* Smart speaker integration
* Music recommendation system

**Thank You! 🙏**
*Questions welcome*


