// User types
export interface User {
  id: string;
  username: string;
  email: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserRegister {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

// Course types
export interface Course {
  id: string;
  title: string;
  description: string;
  instructor_id: string;
}

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  content: string;
  order: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct_option_index: number;
}

export interface Quiz {
  id: string;
  lesson_id: string;
  title: string;
  questions: QuizQuestion[];
}

export interface QuizAttempt {
  quiz_id: string;
  answers: number[];
  score?: number;
}

export interface Progress {
  lessons_completed: Record<string, boolean>;
  overall_progress: number;
}
