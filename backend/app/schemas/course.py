from pydantic import BaseModel
from typing import List, Optional

class CourseBase(BaseModel):
    title: str
    description: str

class CourseCreate(CourseBase):
    pass

class CourseResponse(CourseBase):
    id: str
    instructor_id: str
    
    class Config:
        from_attributes = True

class LessonBase(BaseModel):
    title: str
    content: str
    order: int

class LessonCreate(LessonBase):
    course_id: str

class LessonResponse(LessonBase):
    id: str
    course_id: str
    
    class Config:
        from_attributes = True

class QuizQuestionBase(BaseModel):
    question: str
    options: List[str]
    correct_option_index: int

class QuizBase(BaseModel):
    title: str
    questions: List[QuizQuestionBase]

class QuizCreate(QuizBase):
    lesson_id: str

class QuizResponse(QuizBase):
    id: str
    lesson_id: str
    
    class Config:
        from_attributes = True

class QuizAttemptBase(BaseModel):
    quiz_id: str
    answers: List[int]  # List of selected option indices

class QuizAttemptCreate(QuizAttemptBase):
    pass

class QuizAttemptResponse(QuizAttemptBase):
    id: str
    user_id: str
    score: float
    
    class Config:
        from_attributes = True

class ProgressUpdate(BaseModel):
    lesson_id: str
    completed: bool

class ProgressResponse(BaseModel):
    lessons_completed: dict
    overall_progress: float
    
    class Config:
        from_attributes = True
