# 🗄️ Database Design

## Overview

InterviewAce AI uses **Amazon DynamoDB** as its primary database.

DynamoDB is a NoSQL database designed for high scalability, low latency, and seamless integration with AWS services.

The database stores:

- Interview Results
- Dashboard Statistics (derived)
- User Profiles (Future)
- Resume Analysis (Future)
- Subscription Data (Future)

---

# Design Philosophy

The database is designed around **access patterns**, not relationships.

Goals:

- Fast Queries
- Minimal Scans
- Cost Efficient
- Highly Scalable
- Simple Data Model

---

# Current Database

## Table

```
InterviewAce-Interviews
```

---

# Primary Keys

## Partition Key

```
userId
```

Obtained from the authenticated AWS Cognito user.

---

## Sort Key

```
interviewId
```

Example

```
2026-07-29T10:30:15Z#8c3e0b2f
```

The timestamp prefix keeps interview records naturally ordered.

---

# Item Structure

Example Interview

```json
{
  "userId": "cognito-user-id",
  "interviewId": "2026-07-29T10:30:15Z#8c3e0b2f",

  "type": "technical",

  "role": "Frontend Developer",

  "experience": "3-5 Years",

  "difficulty": "Medium",

  "language": "JavaScript",

  "questions": [
    "...",
    "..."
  ],

  "answers": [
    "...",
    "..."
  ],

  "evaluation": {
    "overallScore": 85,
    "technicalScore": 90,
    "communicationScore": 80,
    "confidenceScore": 86,

    "strengths": [],

    "improvements": [],

    "questionFeedback": []
  },

  "durationSeconds": 1200,

  "status": "completed",

  "createdAt": "2026-07-29T10:30:15Z"
}
```

---

# Access Patterns

The application currently needs to support the following queries.

---

## 1. Save Interview

```
POST /api/interviews
```

Operation

```
PutItem
```

---

## 2. Get Recent Interviews

```
GET /dashboard/recent
```

Query

```
Partition Key = userId

Sort Descending

Limit = 5
```

No table scan required.

---

## 3. Get Dashboard Statistics

```
GET /dashboard/stats
```

Uses

```
Query by userId
```

Calculates

- Total Interviews
- Average Score
- Best Score
- Practice Time

Future optimization may cache these values.

---

## 4. Get Interview Details

```
GET /interviews/{id}
```

Uses

```
userId
interviewId
```

Returns a single interview.

---

# Future Access Patterns

- Filter by Interview Type
- Filter by Difficulty
- Filter by Date
- Search Interviews

These may require Global Secondary Indexes (GSIs).

---

# Future Global Secondary Indexes

## GSI 1

Partition Key

```
userId
```

Sort Key

```
createdAt
```

Purpose

- Recent Interviews
- Date Filtering

---

## GSI 2

Partition Key

```
userId
```

Sort Key

```
type
```

Purpose

Filter

- Technical
- Behavioral
- Coding

---

# Data Ownership

Each interview belongs to one authenticated user.

```
1 User

↓

Many Interviews
```

Users cannot access interviews belonging to another user.

---

# Data Validation

Every interview should contain:

- Interview Type
- Role
- Experience
- Difficulty
- Questions
- Answers
- Evaluation
- Created Date

Invalid requests should be rejected before writing to DynamoDB.

---

# Security

Never trust values sent from the frontend.

The backend should always:

- Verify Cognito JWT
- Extract userId from JWT
- Ignore userId sent by clients

---

# Performance Guidelines

Prefer

```
Query
```

Avoid

```
Scan
```

Scans become expensive as data grows.

---

# Naming Conventions

Table

```
InterviewAce-Interviews
```

Future Tables

```
InterviewAce-Profiles

InterviewAce-Resumes

InterviewAce-Subscriptions

InterviewAce-Settings
```

Maintain consistent naming across AWS resources.

---

# Backup Strategy

Enable:

- Point-in-Time Recovery (PITR)

Recommended:

- AWS Backup

---

# Future Improvements

Future versions may include:

- Dashboard cache
- Interview analytics
- AI coaching history
- Resume history
- Coding submissions
- Leaderboards

The current schema is intentionally simple to support rapid MVP development while remaining scalable.