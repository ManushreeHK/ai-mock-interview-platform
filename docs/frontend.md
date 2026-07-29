# 🎨 Frontend Architecture

## Overview

The InterviewAce AI frontend is built using **React**, **TypeScript**, and **Vite**. The application follows a component-based architecture with reusable UI components, centralized API services, and clean separation of concerns.

---

# Technology Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- AWS Amplify
- AWS Cognito

---

# Frontend Folder Structure

```
src/
│
├── assets/              # Images, icons, logos
├── components/          # Reusable UI components
├── hooks/               # Custom React hooks
├── layouts/             # Shared layouts
├── pages/               # Route pages
├── services/            # API calls
├── types/               # TypeScript types
├── utils/               # Helper functions
├── App.tsx
└── main.tsx
```

---

# Routing Structure

```
/
│
├── Landing Page
├── Login
├── Signup
├── Verify Email
│
└── Protected
     │
     ├── Dashboard
     ├── Create Interview
     ├── Interview
     ├── Results
     └── Profile (Planned)
```

---

# Layouts

## Public Layout

Used for:

- Landing Page
- Login
- Signup
- Verify Email

Responsibilities:

- Navbar
- Footer
- Public Routes

---

## App Layout

Used after login.

Responsibilities:

- Sidebar
- Header
- Protected Routes
- User Navigation

---

# Current Pages

## Landing Page

Purpose

Introduce InterviewAce AI.

Contains

- Hero Section
- Features
- Benefits
- CTA

---

## Dashboard

Purpose

Display interview statistics.

Contains

- Welcome Banner
- Statistics Cards
- Weekly Progress
- Recent Interviews
- AI Insights
- Quick Actions
- Achievements

Current Status

Uses mock data.

Future

Uses backend APIs.

---

## Create Interview

Purpose

Configure an interview.

Contains

- Interview Type
- Role
- Experience
- Difficulty
- Programming Language
- Interview Summary

Hero

```
✨ Create Your AI Interview
```

---

## Interview Page

Purpose

Conduct AI interview.

Contains

- Question Card
- Progress Indicator
- Timer
- Recording Section
- Navigation

Features

- Voice Recording
- Speech Recognition
- Previous
- Next
- Finish

---

## Results Page

Purpose

Display interview evaluation.

Contains

- Overall Score
- Technical Score
- Communication Score
- Confidence Score
- Strengths
- Improvements
- Question Feedback

---

# Components

Reusable components should remain presentation-only.

Business logic should stay inside pages or services.

Examples:

```
components/

Button/

Input/

Card/

Header/

Sidebar/

StatsCard/

InterviewCard/

QuestionCard/

RecordingSection/

InterviewNavigation/

InterviewTimer/

InterviewProgress/
```

---

# Services

All API communication should remain inside the services folder.

Example:

```
services/

auth.service.ts

interview.service.ts

dashboard.service.ts

profile.service.ts
```

Components should never make direct API calls.

---

# Hooks

Custom hooks should contain reusable logic.

Examples

```
hooks/

useAuth.ts

useSpeechRecognition.ts

useDashboard.ts

useInterview.ts
```

---

# TypeScript

All API requests and responses should use interfaces.

Avoid using `any`.

Example

```
interface Interview {

}

interface DashboardStats {

}

interface InterviewResult {

}
```

---

# Styling Guidelines

Tailwind CSS is the primary styling solution.

Rules

- Prefer utility classes.
- Avoid inline styles.
- Create reusable components.
- Keep spacing consistent.

---

# UI Design Principles

InterviewAce AI follows a modern SaaS design.

Goals

- Clean
- Professional
- Minimal
- AI-first
- Responsive

Avoid

- Cluttered layouts
- Excessive text
- Large forms
- Unnecessary animations

---

# State Management

Current

- React State
- Context API

Future (If Needed)

- React Query
- Zustand

State libraries should only be introduced when complexity increases.

---

# Error Handling

Every API call should handle

- Loading
- Success
- Error
- Empty State

Never leave users without feedback.

---

# Performance Guidelines

- Lazy load pages where appropriate.
- Reuse components.
- Avoid unnecessary re-renders.
- Keep bundle size small.
- Memoize expensive calculations.

---

# Accessibility

All pages should support

- Keyboard navigation
- Proper labels
- Semantic HTML
- Focus indicators

---

# Coding Guidelines

- Functional Components only.
- TypeScript everywhere.
- Reusable components.
- Keep components small.
- Avoid duplicate code.
- Keep business logic out of UI components.
- Prefer composition over large components.

---

# Future Frontend Features

- Profile
- Resume Upload
- Coding Playground
- AI Coach
- Notifications
- Subscription UI