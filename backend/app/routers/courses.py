from fastapi import APIRouter, HTTPException, Depends
from typing import List

from ..schemas.course import (
    CourseCreate, CourseResponse, 
    LessonCreate, LessonResponse,
    QuizCreate, QuizResponse,
    ProgressUpdate, ProgressResponse
)
from ..database.db import db
from .auth import get_current_user

router = APIRouter(prefix="/courses", tags=["courses"])

# Course routes
@router.post("", response_model=CourseResponse)
async def create_course(
    course_data: CourseCreate, 
    current_user: dict = Depends(get_current_user)
):
    course = db.create_course(
        title=course_data.title,
        description=course_data.description,
        instructor_id=current_user["id"]
    )
    return course

@router.get("", response_model=List[CourseResponse])
async def get_all_courses():
    return db.get_all_courses()

@router.get("/{course_id}", response_model=CourseResponse)
async def get_course(course_id: str):
    course = db.get_course(course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course

# Lesson routes
@router.post("/{course_id}/lessons", response_model=LessonResponse)
async def create_lesson(
    course_id: str,
    lesson_data: LessonCreate,
    current_user: dict = Depends(get_current_user)
):
    # Verify course exists and user is the instructor
    course = db.get_course(course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    if course["instructor_id"] != current_user["id"]:
        raise HTTPException(status_code=403, detail="Only the course instructor can add lessons")
    
    lesson = db.create_lesson(
        course_id=course_id,
        title=lesson_data.title,
        content=lesson_data.content,
        order=lesson_data.order
    )
    return lesson

@router.get("/{course_id}/lessons", response_model=List[LessonResponse])
async def get_course_lessons(course_id: str):
    # Verify course exists
    course = db.get_course(course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    return db.get_lessons_by_course(course_id)

@router.get("/{course_id}/lessons/{lesson_id}", response_model=LessonResponse)
async def get_lesson(course_id: str, lesson_id: str):
    # Verify course exists
    course = db.get_course(course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    lesson = db.get_lesson(lesson_id)
    if not lesson or lesson["course_id"] != course_id:
        raise HTTPException(status_code=404, detail="Lesson not found")
    
    return lesson

# Quiz routes
@router.post("/{course_id}/lessons/{lesson_id}/quizzes", response_model=QuizResponse)
async def create_quiz(
    course_id: str,
    lesson_id: str,
    quiz_data: QuizCreate,
    current_user: dict = Depends(get_current_user)
):
    # Verify course and lesson exist
    course = db.get_course(course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    lesson = db.get_lesson(lesson_id)
    if not lesson or lesson["course_id"] != course_id:
        raise HTTPException(status_code=404, detail="Lesson not found")
    
    # Verify user is the instructor
    if course["instructor_id"] != current_user["id"]:
        raise HTTPException(status_code=403, detail="Only the course instructor can add quizzes")
    
    quiz = db.create_quiz(
        lesson_id=lesson_id,
        title=quiz_data.title,
        questions=quiz_data.questions
    )
    return quiz

@router.get("/{course_id}/lessons/{lesson_id}/quizzes", response_model=List[QuizResponse])
async def get_lesson_quizzes(course_id: str, lesson_id: str):
    # Verify course and lesson exist
    course = db.get_course(course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    lesson = db.get_lesson(lesson_id)
    if not lesson or lesson["course_id"] != course_id:
        raise HTTPException(status_code=404, detail="Lesson not found")
    
    return db.get_quizzes_by_lesson(lesson_id)

# Progress tracking routes
@router.post("/{course_id}/progress", response_model=ProgressResponse)
async def update_progress(
    course_id: str,
    progress_data: ProgressUpdate,
    current_user: dict = Depends(get_current_user)
):
    # Verify course and lesson exist
    course = db.get_course(course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    lesson = db.get_lesson(progress_data.lesson_id)
    if not lesson or lesson["course_id"] != course_id:
        raise HTTPException(status_code=404, detail="Lesson not found")
    
    progress = db.update_user_progress(
        user_id=current_user["id"],
        course_id=course_id,
        lesson_id=progress_data.lesson_id,
        completed=progress_data.completed
    )
    return progress

@router.get("/{course_id}/progress", response_model=ProgressResponse)
async def get_course_progress(
    course_id: str,
    current_user: dict = Depends(get_current_user)
):
    # Verify course exists
    course = db.get_course(course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    progress = db.get_user_course_progress(
        user_id=current_user["id"],
        course_id=course_id
    )
    
    if not progress:
        # Return empty progress if user hasn't started the course
        return {"lessons_completed": {}, "overall_progress": 0.0}
    
    return progress
