import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { courseService } from '../services/api';
import { Course } from '../types';

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await courseService.getAllCourses();
        setCourses(data);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
        setError('Failed to load courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <Layout>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h1 className="text-3xl font-bold text-gray-900">Available Courses</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Browse our selection of interactive courses
          </p>
        </div>

        {loading ? (
          <div className="px-4 py-5 sm:p-6 text-center">
            <p>Loading courses...</p>
          </div>
        ) : error ? (
          <div className="px-4 py-5 sm:p-6 text-center text-red-500">
            <p>{error}</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="px-4 py-5 sm:p-6 text-center">
            <p>No courses available at the moment.</p>
          </div>
        ) : (
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
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
                      View Course
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Courses;
