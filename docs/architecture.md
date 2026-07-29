# 🏗️ InterviewAce AI - System Architecture

## Overview

InterviewAce AI follows a modern client-server architecture.

The application consists of:

- React Frontend
- Node.js + Express Backend
- AWS Cognito Authentication
- Google Gemini AI
- AWS DynamoDB (Planned)

---

# High-Level Architecture

```text
                    +----------------------+
                    |      React App       |
                    | (TypeScript + Vite)  |
                    +----------+-----------+
                               |
                               | HTTPS REST APIs
                               |
                    +----------v-----------+
                    |   Node.js + Express  |
                    |      Backend API     |
                    +----------+-----------+
                               |
          +--------------------+--------------------+
          |                                         |
          |                                         |
+---------v---------+                    +----------v---------+
|  Google Gemini AI |                    |   AWS DynamoDB     |
| Question Generator|                    | Interview Storage  |
+-------------------+                    +--------------------+
                               |
                               |
                    +----------v-----------+
                    |   AWS Cognito        |
                    | Authentication       |
                    +----------------------+
```

---

# Frontend Architecture

The frontend is built using React with TypeScript.

Responsibilities:

- User Authentication
- Dashboard
- Interview Configuration
- Interview Experience
- Results Visualization
- API Communication

The frontend contains **no business logic**.

Business logic should always remain inside the backend.

---

# Backend Architecture

Backend is built using:

- Node.js
- Express.js

Responsibilities:

- Authentication validation
- AI communication
- Interview generation
- Interview evaluation
- Save interview results
- Dashboard statistics
- Database access

The backend acts as the single source of truth.

---

# Authentication Flow

Authentication is handled by AWS Cognito.

Flow:

```text
User Login
      │
      ▼
AWS Cognito
      │
      ▼
JWT Access Token
      │
      ▼
Frontend Stores Token
      │
      ▼
API Requests
      │
      ▼
Backend Validates Token
```

The backend should never trust a user ID sent from the frontend.

Instead, it should extract the user's identity from the verified Cognito token.

---

# Interview Flow

```text
Create Interview
        │
        ▼
Select Type
        │
        ▼
Generate AI Questions
        │
        ▼
Interview Session
        │
        ▼
Voice Recording
        │
        ▼
Speech Recognition
        │
        ▼
Finish Interview
        │
        ▼
AI Evaluation
        │
        ▼
Save Interview
        │
        ▼
Results Page
```

---

# Dashboard Flow

```text
Dashboard Loads
       │
       ▼
Fetch Dashboard Statistics
       │
       ▼
Fetch Recent Interviews
       │
       ▼
Display User Progress
```

Dashboard should always display real data fetched from the backend.

---

# Data Flow

```text
React
   │
   ▼
Express API
   │
   ▼
Gemini API
   │
   ▼
Receive Evaluation
   │
   ▼
Save Interview to DynamoDB
   │
   ▼
Return Response
   │
   ▼
Results Page
```

---

# Current Pages

- Landing Page
- Login
- Signup
- Verify Email
- Dashboard
- Create Interview
- Interview
- Results

Future:

- Profile

---

# Current Features

## Authentication

- Signup
- Login
- Logout
- Email Verification

---

## Dashboard

- Statistics
- Weekly Progress
- Recent Interviews
- AI Insights
- Achievements

(Currently using mock data.)

---

## Interview

- Technical Interview
- Behavioral Interview
- Coding Interview (UI)

Voice Features:

- Speech Recognition
- Voice Recording
- Interview Timer
- Navigation
- Auto Submission

---

## Results

Displays:

- Overall Score
- Technical Score
- Communication Score
- Confidence Score
- Strengths
- Improvements
- Question Feedback

---

# Design Principles

InterviewAce AI follows these principles:

- Clean Architecture
- Separation of Concerns
- Reusable Components
- Scalable APIs
- Mobile Responsive
- Minimal UI
- AI-First Experience
- Type Safety with TypeScript

---

# Future Architecture

As the application grows, additional services may be added:

- Resume Analysis
- AI Coach
- Coding Execution Service
- Subscription Service
- Email Notifications
- Analytics

The current architecture is intentionally simple to support rapid MVP development while allowing future expansion.