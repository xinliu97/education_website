import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

const Home: React.FC = () => {
  return (
    <Layout>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to Educational Platform</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Your gateway to interactive learning experiences
          </p>
        </div>
        <div className="border-t border-gray-200">
          <div className="px-4 py-5 sm:p-6">
            <div className="prose max-w-none">
              <p>
                Our educational platform provides a comprehensive learning experience with interactive
                courses, quizzes, and progress tracking. Whether you're a student looking to expand
                your knowledge or an instructor wanting to share your expertise, our platform has
                everything you need.
              </p>
              
              <h2 className="text-xl font-semibold mt-6">Key Features</h2>
              <ul className="mt-4 space-y-2">
                <li>Access to a wide variety of courses</li>
                <li>Interactive lessons with rich content</li>
                <li>Quizzes to test your knowledge</li>
                <li>Progress tracking to monitor your learning journey</li>
                <li>Discussion forums to engage with other learners</li>
              </ul>
              
              <div className="mt-8 flex space-x-4">
                <Link
                  to="/courses"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Browse Courses
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Sign Up Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
