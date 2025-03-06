from typing import Dict, List, Optional
import uuid

# In-memory database for development purposes
class InMemoryDB:
    def __init__(self):
        self.users: Dict[str, dict] = {}
        self.courses: Dict[str, dict] = {}
        self.lessons: Dict[str, dict] = {}
        self.quizzes: Dict[str, dict] = {}
        self.quiz_attempts: Dict[str, List[dict]] = {}
        self.user_progress: Dict[str, Dict[str, dict]] = {}  # user_id -> course_id -> progress

    # User methods
    def create_user(self, username: str, email: str, hashed_password: str) -> dict:
        user_id = str(uuid.uuid4())
        user = {
            "id": user_id,
            "username": username,
            "email": email,
            "password": hashed_password,
            "created_at": "2025-03-06T00:00:00Z"  # Simplified timestamp
        }
        self.users[user_id] = user
        return user
    
    def get_user_by_id(self, user_id: str) -> Optional[dict]:
        return self.users.get(user_id)
    
    def get_user_by_email(self, email: str) -> Optional[dict]:
        for user in self.users.values():
            if user["email"] == email:
                return user
        return None
    
    def get_user_by_username(self, username: str) -> Optional[dict]:
        for user in self.users.values():
            if user["username"] == username:
                return user
        return None
    
    # Course methods
    def create_course(self, title: str, description: str, instructor_id: str) -> dict:
        course_id = str(uuid.uuid4())
        course = {
            "id": course_id,
            "title": title,
            "description": description,
            "instructor_id": instructor_id,
            "created_at": "2025-03-06T00:00:00Z"  # Simplified timestamp
        }
        self.courses[course_id] = course
        return course
    
    def get_course(self, course_id: str) -> Optional[dict]:
        return self.courses.get(course_id)
    
    def get_all_courses(self) -> List[dict]:
        return list(self.courses.values())
    
    # Lesson methods
    def create_lesson(self, course_id: str, title: str, content: str, order: int) -> dict:
        lesson_id = str(uuid.uuid4())
        lesson = {
            "id": lesson_id,
            "course_id": course_id,
            "title": title,
            "content": content,
            "order": order,
            "created_at": "2025-03-06T00:00:00Z"  # Simplified timestamp
        }
        self.lessons[lesson_id] = lesson
        return lesson
    
    def get_lesson(self, lesson_id: str) -> Optional[dict]:
        return self.lessons.get(lesson_id)
    
    def get_lessons_by_course(self, course_id: str) -> List[dict]:
        return [lesson for lesson in self.lessons.values() if lesson["course_id"] == course_id]
    
    # Quiz methods
    def create_quiz(self, lesson_id: str, title: str, questions: List[dict]) -> dict:
        quiz_id = str(uuid.uuid4())
        quiz = {
            "id": quiz_id,
            "lesson_id": lesson_id,
            "title": title,
            "questions": questions,
            "created_at": "2025-03-06T00:00:00Z"  # Simplified timestamp
        }
        self.quizzes[quiz_id] = quiz
        return quiz
    
    def get_quiz(self, quiz_id: str) -> Optional[dict]:
        return self.quizzes.get(quiz_id)
    
    def get_quizzes_by_lesson(self, lesson_id: str) -> List[dict]:
        return [quiz for quiz in self.quizzes.values() if quiz["lesson_id"] == lesson_id]
    
    # Quiz attempt methods
    def record_quiz_attempt(self, user_id: str, quiz_id: str, answers: List[dict], score: float) -> dict:
        attempt_id = str(uuid.uuid4())
        attempt = {
            "id": attempt_id,
            "user_id": user_id,
            "quiz_id": quiz_id,
            "answers": answers,
            "score": score,
            "created_at": "2025-03-06T00:00:00Z"  # Simplified timestamp
        }
        
        if user_id not in self.quiz_attempts:
            self.quiz_attempts[user_id] = []
            
        self.quiz_attempts[user_id].append(attempt)
        return attempt
    
    def get_quiz_attempts_by_user(self, user_id: str) -> List[dict]:
        return self.quiz_attempts.get(user_id, [])
    
    # Progress tracking methods
    def update_user_progress(self, user_id: str, course_id: str, lesson_id: str, completed: bool) -> dict:
        if user_id not in self.user_progress:
            self.user_progress[user_id] = {}
            
        if course_id not in self.user_progress[user_id]:
            self.user_progress[user_id][course_id] = {
                "lessons_completed": {},
                "overall_progress": 0.0
            }
            
        self.user_progress[user_id][course_id]["lessons_completed"][lesson_id] = completed
        
        # Calculate overall progress
        course_lessons = self.get_lessons_by_course(course_id)
        if course_lessons:
            completed_count = sum(1 for lesson_id, is_completed in 
                                self.user_progress[user_id][course_id]["lessons_completed"].items() 
                                if is_completed)
            progress = completed_count / len(course_lessons) * 100
            self.user_progress[user_id][course_id]["overall_progress"] = progress
            
        return self.user_progress[user_id][course_id]
    
    def get_user_course_progress(self, user_id: str, course_id: str) -> Optional[dict]:
        if user_id in self.user_progress and course_id in self.user_progress[user_id]:
            return self.user_progress[user_id][course_id]
        return None
    
    def get_user_all_progress(self, user_id: str) -> Dict[str, dict]:
        return self.user_progress.get(user_id, {})


# Create a singleton instance
db = InMemoryDB()
