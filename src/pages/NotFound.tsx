import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="max-w-xl text-center">
        <h1 className="text-7xl font-extrabold text-blue-700 mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">Oops! Page not found</h2>
        <p className="text-gray-600 mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            <Home className="w-5 h-5 mr-2" /> Back to Home
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center px-6 py-3 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-lg font-medium transition-colors"
          >
            <Search className="w-5 h-5 mr-2" /> Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 