import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { courseService } from '../services/api';
import { Course } from '../types';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        setLoading(true);
        // In a real application, we would fetch only enrolled courses
        // For this demo, we'll just fetch all courses
        const courses = await courseService.getAllCourses();
        setEnrolledCourses(courses);
      } catch (err) {
        console.error('Failed to fetch enrolled courses:', err);
        setError('Failed to load your courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  return (
    <Layout>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Welcome back, {user?.username}!
          </p>
        </div>

        <div className="border-t border-gray-200">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-xl font-semibold mb-4">Your Courses</h2>
            
            {loading ? (
              <p>Loading your courses...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : enrolledCourses.length === 0 ? (
              <div>
                <p className="text-gray-500 mb-4">You haven't enrolled in any courses yet.</p>
                <Link
                  to="/courses"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Browse Courses
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {enrolledCourses.map((course) => (
                  <div
                    key={course.id}
                    className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex flex-col space-y-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">{course.title}</h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-3">{course.description}</p>
                    </div>
                    <div>
                      <Link
                        to={`/courses/${course.id}`}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Continue Learning
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
