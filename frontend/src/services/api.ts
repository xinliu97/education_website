import axios from 'axios';
import { AuthResponse, Course, Lesson, Progress, Quiz, User } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth services
export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const formData = new FormData();
    formData.append('username', email); // FastAPI OAuth2 expects 'username'
    formData.append('password', password);
    
    const response = await api.post<AuthResponse>('/auth/token', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  register: async (username: string, email: string, password: string): Promise<User> => {
    const response = await api.post<User>('/auth/register', {
      username,
      email,
      password,
    });
    return response.data;
  },
  
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },
};

// Course services
export const courseService = {
  getAllCourses: async (): Promise<Course[]> => {
    const response = await api.get<Course[]>('/courses');
    return response.data;
  },
  
  getCourse: async (courseId: string): Promise<Course> => {
    const response = await api.get<Course>(`/courses/${courseId}`);
    return response.data;
  },
  
  createCourse: async (title: string, description: string): Promise<Course> => {
    const response = await api.post<Course>('/courses', {
      title,
      description,
    });
    return response.data;
  },
};

// Lesson services
export const lessonService = {
  getLessonsByCourse: async (courseId: string): Promise<Lesson[]> => {
    const response = await api.get<Lesson[]>(`/courses/${courseId}/lessons`);
    return response.data;
  },
  
  getLesson: async (courseId: string, lessonId: string): Promise<Lesson> => {
    const response = await api.get<Lesson>(`/courses/${courseId}/lessons/${lessonId}`);
    return response.data;
  },
  
  createLesson: async (courseId: string, title: string, content: string, order: number): Promise<Lesson> => {
    const response = await api.post<Lesson>(`/courses/${courseId}/lessons`, {
      title,
      content,
      order,
    });
    return response.data;
  },
};

// Quiz services
export const quizService = {
  getQuizzesByLesson: async (courseId: string, lessonId: string): Promise<Quiz[]> => {
    const response = await api.get<Quiz[]>(`/courses/${courseId}/lessons/${lessonId}/quizzes`);
    return response.data;
  },
  
  submitQuizAttempt: async (courseId: string, lessonId: string, quizId: string, answers: number[]): Promise<any> => {
    const response = await api.post(`/courses/${courseId}/lessons/${lessonId}/quizzes/${quizId}/attempts`, {
      answers,
    });
    return response.data;
  },
};

// Progress services
export const progressService = {
  getCourseProgress: async (courseId: string): Promise<Progress> => {
    const response = await api.get<Progress>(`/courses/${courseId}/progress`);
    return response.data;
  },
  
  updateProgress: async (courseId: string, lessonId: string, completed: boolean): Promise<Progress> => {
    const response = await api.post<Progress>(`/courses/${courseId}/progress`, {
      lesson_id: lessonId,
      completed,
    });
    return response.data;
  },
};

export default api;
