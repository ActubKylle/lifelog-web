
// src/components/layout/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="text-lg font-semibold text-primary-600">
              LifeLog
            </Link>
            <p className="text-sm text-gray-500 mt-1">
              &copy; {currentYear} LifeLog. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <Link to="#" className="text-gray-500 hover:text-gray-700">
              Home
            </Link>
            <Link to="/privacy" className="text-gray-500 hover:text-gray-700">
              Privacy
            </Link>
            <Link to="/terms" className="text-gray-500 hover:text-gray-700">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;