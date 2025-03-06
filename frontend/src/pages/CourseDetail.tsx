import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { courseService, lessonService, progressService } from '../services/api';
import { Course, Lesson, Progress } from '../types';
import { useAuth } from '../contexts/AuthContext';

const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId) return;
      
      try {
        setLoading(true);
        const courseData = await courseService.getCourse(courseId);
        setCourse(courseData);
        
        const lessonsData = await lessonService.getLessonsByCourse(courseId);
        setLessons(lessonsData);
        
        if (isAuthenticated) {
          try {
            const progressData = await progressService.getCourseProgress(courseId);
            setProgress(progressData);
          } catch (err) {
            console.error('Failed to fetch progress:', err);
            // Non-critical error, don't show to user
          }
        }
      } catch (err) {
        console.error('Failed to fetch course data:', err);
        setError('Failed to load course. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId, isAuthenticated]);

  const getLessonProgress = (lessonId: string) => {
    if (!progress || !progress.lessons_completed) return false;
    return progress.lessons_completed[lessonId] || false;
  };

  return (
    <Layout>
      {loading ? (
        <div className="text-center py-10">
          <p>Loading course...</p>
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">
          <p>{error}</p>
        </div>
      ) : course ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">{course.description}</p>
            
            {isAuthenticated && progress && (
              <div className="mt-4">
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                        Course Progress
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-blue-600">
                        {Math.round(progress.overall_progress)}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                    <div
                      style={{ width: `${progress.overall_progress}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-xl font-semibold mb-4">Lessons</h2>
              
              {lessons.length === 0 ? (
                <p className="text-gray-500">No lessons available for this course yet.</p>
              ) : (
                <div className="space-y-4">
                  {lessons
                    .sort((a, b) => a.order - b.order)
                    .map((lesson) => (
                      <div
                        key={lesson.id}
                        className="border border-gray-200 rounded-md p-4 hover:bg-gray-50"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            {isAuthenticated && getLessonProgress(lesson.id) && (
                              <span className="mr-2 flex-shrink-0 h-5 w-5 text-green-500">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </span>
                            )}
                            <h3 className="text-lg font-medium text-gray-900">
                              {lesson.order}. {lesson.title}
                            </h3>
                          </div>
                          <Link
                            to={`/courses/${courseId}/lessons/${lesson.id}`}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Start Lesson
                          </Link>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-10">
          <p>Course not found.</p>
        </div>
      )}
    </Layout>
  );
};

export default CourseDetail;
