# 🚀 Backend Architecture

## Overview

The InterviewAce AI backend is built using **Node.js**, **Express.js**, and **TypeScript**.

The backend is responsible for:

- User authentication validation
- AI interview generation
- AI interview evaluation
- Interview persistence
- Dashboard statistics
- Database communication
- API security

The backend acts as the **single source of truth** for all application data.

---

# Technology Stack

- Node.js
- Express.js
- TypeScript
- AWS SDK v3
- AWS Cognito
- Google Gemini API
- DynamoDB (Planned)

---

# Folder Structure

```
backend/
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   ├── types/
│   ├── utils/
│   ├── app.ts
│   └── server.ts
│
├── package.json
└── tsconfig.json
```

---

# Folder Responsibilities

## config/

Stores application configuration.

Examples

- AWS SDK
- Environment Variables
- Gemini Client

---

## controllers/

Controllers should only:

- Receive HTTP requests
- Validate request
- Call service
- Return HTTP response

Controllers should NOT contain business logic.

---

## services/

Services contain all business logic.

Examples

- InterviewService
- DashboardService
- AIService

Services may call:

- Repositories
- External APIs

---

## repositories/

Repositories communicate with DynamoDB.

Repositories should contain:

- Save Interview
- Get Interview
- Get Dashboard Data

Business logic should never directly access DynamoDB.

---

## middleware/

Examples

- Authentication
- Error Handler
- Logger
- Request Validation

---

## routes/

Defines API routes.

Example

```
routes/

dashboard.routes.ts

interview.routes.ts

profile.routes.ts
```

---

## utils/

Reusable helper functions.

Examples

- Date Formatter
- Score Calculator
- Logger
- Response Helpers

---

# Authentication

Authentication is handled by AWS Cognito.

Flow

```
Client Login

↓

AWS Cognito

↓

JWT Token

↓

Express Middleware

↓

Protected API
```

Every protected API should validate the access token.

Never trust userId sent by the frontend.

Always extract the user identity from the verified JWT.

---

# Request Flow

```
Client Request

↓

Express Route

↓

Controller

↓

Service

↓

Repository

↓

DynamoDB
```

This separation keeps the project clean and maintainable.

---

# Response Format

Every API should return a consistent response.

Success

```json
{
  "success": true,
  "data": {}
}
```

Error

```json
{
  "success": false,
  "message": "Something went wrong."
}
```

---

# Error Handling

A centralized error middleware should handle:

- Validation errors
- Authentication errors
- Database errors
- AI service errors
- Unexpected exceptions

Controllers should never contain try/catch blocks for every endpoint if centralized middleware is handling them.

---

# Logging

Log:

- API requests
- API errors
- AI requests
- AI failures
- Database failures

Never log:

- Passwords
- Tokens
- Sensitive user information

---

# Validation

Every incoming request should be validated.

Examples

Interview creation

- Interview Type
- Role
- Experience
- Difficulty

Interview evaluation

- Questions
- Answers

Never trust frontend data.

---

# Environment Variables

```
PORT=

AWS_REGION=

COGNITO_USER_POOL_ID=

COGNITO_USER_POOL_CLIENT_ID=

GEMINI_API_KEY=
```

These values should never be committed to Git.

---

# Current APIs

Interview APIs

```
POST /api/interviews
GET  /api/interviews/:id
```

Dashboard APIs

```
GET /api/dashboard/stats
GET /api/dashboard/recent
```

Future APIs

```
GET /api/profile
PUT /api/profile

POST /api/resume/analyze

POST /api/coding/evaluate
```

---

# Service Layer

Current Services

- InterviewService
- DashboardService
- AIService

Future Services

- ProfileService
- ResumeService
- CodingService
- SubscriptionService

---

# Repository Layer

Repositories should only perform CRUD operations.

Examples

InterviewRepository

- saveInterview()
- getInterview()
- getRecentInterviews()
- getDashboardStats()

Repositories should never contain business logic.

---

# Coding Principles

- Thin Controllers
- Fat Services
- Repository Pattern
- TypeScript Everywhere
- Reusable Utilities
- Centralized Error Handling
- Consistent API Responses

---

# Future Improvements

- Request Rate Limiting
- API Versioning
- Request Tracing
- CloudWatch Logging
- Unit Tests
- Integration Tests
- CI/CD Pipeline

The architecture is designed to scale as InterviewAce AI grows while remaining easy to maintain.
