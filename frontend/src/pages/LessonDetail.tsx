import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { lessonService, quizService, progressService } from '../services/api';
import { Lesson, Quiz, QuizQuestion } from '../types';
import { useAuth } from '../contexts/AuthContext';

const LessonDetail: React.FC = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lessonCompleted, setLessonCompleted] = useState(false);
  
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLessonData = async () => {
      if (!courseId || !lessonId) return;
      
      try {
        setLoading(true);
        const lessonData = await lessonService.getLesson(courseId, lessonId);
        setLesson(lessonData);
        
        // Fetch quizzes for this lesson
        const quizzesData = await quizService.getQuizzesByLesson(courseId, lessonId);
        
        // Initialize quiz answers if there are quizzes
        if (quizzesData.length > 0) {
          setCurrentQuiz(quizzesData[0]);
          setQuizAnswers(new Array(quizzesData[0].questions.length).fill(-1));
        }
        
        // Mark lesson as completed if authenticated
        if (isAuthenticated) {
          try {
            await progressService.updateProgress(courseId, lessonId, true);
            setLessonCompleted(true);
          } catch (err) {
            console.error('Failed to update progress:', err);
          }
        }
      } catch (err) {
        console.error('Failed to fetch lesson data:', err);
        setError('Failed to load lesson. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchLessonData();
  }, [courseId, lessonId, isAuthenticated]);

  const handleQuizAnswerSelect = (questionIndex: number, optionIndex: number) => {
    const newAnswers = [...quizAnswers];
    newAnswers[questionIndex] = optionIndex;
    setQuizAnswers(newAnswers);
  };

  const handleQuizSubmit = () => {
    if (!currentQuiz) return;
    
    // Calculate score
    let correctCount = 0;
    currentQuiz.questions.forEach((question, index) => {
      if (quizAnswers[index] === question.correct_option_index) {
        correctCount++;
      }
    });
    
    const score = (correctCount / currentQuiz.questions.length) * 100;
    setQuizScore(score);
    setQuizSubmitted(true);
  };

  const handleNextLesson = () => {
    if (!courseId) return;
    navigate(`/courses/${courseId}`);
  };

  return (
    <Layout>
      {loading ? (
        <div className="text-center py-10">
          <p>Loading lesson...</p>
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">
          <p>{error}</p>
        </div>
      ) : lesson ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h1 className="text-3xl font-bold text-gray-900">{lesson.title}</h1>
            {isAuthenticated && lessonCompleted && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
                Completed
              </span>
            )}
          </div>

          <div className="border-t border-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <div className="prose max-w-none">
                {/* Render lesson content */}
                <div dangerouslySetInnerHTML={{ __html: lesson.content.replace(/\n/g, '<br />') }} />
              </div>
              
              {/* Quiz section */}
              {currentQuiz && (
                <div className="mt-8 border-t border-gray-200 pt-8">
                  <h2 className="text-xl font-semibold mb-4">{currentQuiz.title}</h2>
                  
                  {quizSubmitted ? (
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h3 className="text-lg font-medium text-gray-900">Quiz Results</h3>
                      <p className="mt-2 text-sm text-gray-500">
                        You scored {quizScore !== null ? Math.round(quizScore) : 0}% on this quiz.
                      </p>
                      
                      <div className="mt-4">
                        {currentQuiz.questions.map((question, qIndex) => (
                          <div key={qIndex} className="mb-4">
                            <p className="font-medium">{question.question}</p>
                            <ul className="mt-2 space-y-2">
                              {question.options.map((option, oIndex) => (
                                <li
                                  key={oIndex}
                                  className={`px-3 py-2 rounded-md ${
                                    oIndex === question.correct_option_index
                                      ? 'bg-green-100 text-green-800'
                                      : quizAnswers[qIndex] === oIndex && oIndex !== question.correct_option_index
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-gray-100 text-gray-800'
                                  }`}
                                >
                                  {option}
                                  {oIndex === question.correct_option_index && (
                                    <span className="ml-2 text-green-600">✓ Correct</span>
                                  )}
                                  {quizAnswers[qIndex] === oIndex && oIndex !== question.correct_option_index && (
                                    <span className="ml-2 text-red-600">✗ Your answer</span>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                      
                      <button
                        onClick={handleNextLesson}
                        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Back to Course
                      </button>
                    </div>
                  ) : (
                    <div>
                      {currentQuiz.questions.map((question: QuizQuestion, qIndex: number) => (
                        <div key={qIndex} className="mb-6">
                          <p className="font-medium mb-2">{question.question}</p>
                          <div className="space-y-2">
                            {question.options.map((option: string, oIndex: number) => (
                              <div key={oIndex} className="flex items-center">
                                <input
                                  id={`question-${qIndex}-option-${oIndex}`}
                                  name={`question-${qIndex}`}
                                  type="radio"
                                  checked={quizAnswers[qIndex] === oIndex}
                                  onChange={() => handleQuizAnswerSelect(qIndex, oIndex)}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                />
                                <label
                                  htmlFor={`question-${qIndex}-option-${oIndex}`}
                                  className="ml-3 block text-sm font-medium text-gray-700"
                                >
                                  {option}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                      
                      <button
                        onClick={handleQuizSubmit}
                        disabled={quizAnswers.includes(-1)}
                        className={`mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                          quizAnswers.includes(-1)
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                        }`}
                      >
                        Submit Quiz
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              {/* Navigation buttons */}
              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => navigate(`/courses/${courseId}`)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Back to Course
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-10">
          <p>Lesson not found.</p>
        </div>
      )}
    </Layout>
  );
};

export default LessonDetail;
