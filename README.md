# Educational Website

A comprehensive educational platform built with React and Python, designed to provide interactive learning experiences for students.

## Table of Contents

- [System Architecture](#system-architecture)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Demo Accounts](#demo-accounts)

## System Architecture

The educational website follows a client-server architecture with a clear separation between the frontend and backend:

### Frontend Architecture

The frontend is built using React with TypeScript, following a component-based architecture:

- **Components Layer**: Reusable UI components (Layout, forms, etc.)
- **Pages Layer**: Complete page components that utilize smaller components
- **Context Layer**: Global state management using React Context API
- **Services Layer**: API communication services
- **Types Layer**: TypeScript interfaces for type safety

The frontend uses React Router for navigation and client-side routing, with protected routes for authenticated users.

### Backend Architecture

The backend is built using Python with FastAPI, following a modular architecture:

- **API Layer**: FastAPI routes and endpoints
- **Schema Layer**: Pydantic models for request/response validation
- **Database Layer**: Data access and storage (currently in-memory for demonstration)
- **Authentication Layer**: JWT-based authentication system

The backend follows RESTful API principles and uses JSON for data exchange.

## Features

### User Authentication

- User registration with email and password
- Secure login with JWT token authentication
- Protected routes for authenticated users
- User session management

### Course Management

- Browse available courses
- View course details and lessons
- Track course progress
- Course completion status

### Interactive Learning

- Structured lessons with rich content
- Interactive quizzes with immediate feedback
- Progress tracking for each lesson
- Score calculation for quizzes

### User Dashboard

- Overview of enrolled courses
- Progress tracking across all courses
- Quick access to continue learning

## Technology Stack

### Frontend

- **React**: JavaScript library for building user interfaces
- **TypeScript**: Typed superset of JavaScript
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API requests

### Backend

- **Python**: Programming language
- **FastAPI**: Modern, fast web framework for building APIs
- **Pydantic**: Data validation and settings management
- **JWT**: JSON Web Tokens for authentication
- **CORS**: Cross-Origin Resource Sharing middleware

## Project Structure

```
education_website/
├── backend/
│   ├── app/
│   │   ├── database/
│   │   │   └── db.py
│   │   ├── models/
│   │   ├── routers/
│   │   │   ├── auth.py
│   │   │   └── courses.py
│   │   ├── schemas/
│   │   │   ├── user.py
│   │   │   └── course.py
│   │   └── main.py
│   ├── tests/
│   └── pyproject.toml
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   └── Layout.tsx
    │   ├── contexts/
    │   │   └── AuthContext.tsx
    │   ├── pages/
    │   │   ├── Home.tsx
    │   │   ├── Login.tsx
    │   │   ├── Register.tsx
    │   │   ├── Courses.tsx
    │   │   ├── CourseDetail.tsx
    │   │   ├── LessonDetail.tsx
    │   │   └── Dashboard.tsx
    │   ├── services/
    │   │   └── api.ts
    │   ├── types/
    │   │   └── index.ts
    │   └── App.tsx
    ├── .env
    └── package.json
```

## Installation

### Prerequisites

- Node.js (v14 or higher)
- Python (v3.8 or higher)
- Poetry (Python dependency management)

### Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
poetry install

# Start the development server
poetry run fastapi dev app/main.py
```

### Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Usage

### User Registration and Login

1. Navigate to the Register page
2. Create an account with username, email, and password
3. Log in with your credentials
4. Access your personalized dashboard

### Browsing Courses

1. Navigate to the Courses page
2. Browse available courses
3. Click on a course to view details
4. Enroll in courses of interest

### Taking Lessons and Quizzes

1. Navigate to a course
2. Select a lesson to start learning
3. Read through the lesson content
4. Complete the quiz at the end of the lesson
5. View your quiz results and progress

## API Documentation

The API documentation is available at `/docs` when running the backend server. It provides detailed information about all available endpoints, request/response schemas, and authentication requirements.

### Key Endpoints

- **Authentication**:
  - `POST /auth/register`: Register a new user
  - `POST /auth/login`: Authenticate a user and get JWT token
  - `GET /auth/me`: Get current user information

- **Courses**:
  - `GET /courses`: Get all available courses
  - `GET /courses/{course_id}`: Get course details
  - `GET /courses/{course_id}/lessons`: Get lessons for a course
  - `GET /courses/{course_id}/lessons/{lesson_id}`: Get lesson details
  - `GET /courses/{course_id}/lessons/{lesson_id}/quizzes`: Get quizzes for a lesson

- **Progress**:
  - `POST /progress/{course_id}/{lesson_id}`: Update lesson progress
  - `GET /progress/{course_id}`: Get progress for a course

## Deployment

The application is deployed and accessible at:

- **Frontend**: https://education-learning-website-xpncvhhg.devinapps.com
- **Backend API**: https://app-riktalkx.fly.dev

### Deployment Architecture

- **Frontend**: Static site hosting with client-side routing
- **Backend**: Containerized deployment on Fly.io
- **API Communication**: CORS-enabled secure communication

## Demo Accounts

For testing purposes, you can use the following demo accounts:

- **Instructor**:
  - Email: instructor@example.com
  - Password: password123

- **Student**:
  - Email: student@example.com
  - Password: password123
