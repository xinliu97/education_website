from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer

from .routers import auth, courses

app = FastAPI(title="Educational Website API")

# Disable CORS. Do not remove this for full-stack development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Include routers
app.include_router(auth.router)
app.include_router(courses.router)

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}

# Add some sample data for demonstration
@app.on_event("startup")
async def startup_event():
    from .database.db import db
    from passlib.context import CryptContext
    
    # Create password hasher
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    
    # Add a demo instructor
    instructor = db.create_user(
        username="instructor",
        email="instructor@example.com",
        hashed_password=pwd_context.hash("password123")
    )
    
    # Add a demo student
    student = db.create_user(
        username="student",
        email="student@example.com",
        hashed_password=pwd_context.hash("password123")
    )
    
    # Add a demo course
    course = db.create_course(
        title="Introduction to Python",
        description="Learn the basics of Python programming language",
        instructor_id=instructor["id"]
    )
    
    # Add some lessons
    lesson1 = db.create_lesson(
        course_id=course["id"],
        title="Getting Started with Python",
        content="Python is a high-level, interpreted programming language...",
        order=1
    )
    
    lesson2 = db.create_lesson(
        course_id=course["id"],
        title="Variables and Data Types",
        content="In Python, variables are created when you assign a value to it...",
        order=2
    )
    
    # Add a quiz
    db.create_quiz(
        lesson_id=lesson1["id"],
        title="Python Basics Quiz",
        questions=[
            {
                "question": "What is Python?",
                "options": [
                    "A snake", 
                    "A programming language", 
                    "A web framework", 
                    "A database"
                ],
                "correct_option_index": 1
            },
            {
                "question": "Which of the following is not a Python data type?",
                "options": [
                    "Integer", 
                    "Float", 
                    "Character", 
                    "String"
                ],
                "correct_option_index": 2
            }
        ]
    )
