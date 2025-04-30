// src/components/auth/Register.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { useAuth } from '../../contexts/AuthContext';
import { UserIcon, KeyIcon, MailIcon, ArrowRightIcon } from 'lucide-react';

const Register = () => {
  const [serverError, setServerError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      passwordConfirmation: '',
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required('Name is required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required'),
      passwordConfirmation: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Please confirm your password'),
    }),
    onSubmit: async (values) => {
      try {
        await register(
          values.name,
          values.email,
          values.password,
          values.passwordConfirmation
        );
        
        Swal.fire({
          title: 'Success!',
          text: 'Your account has been created',
          icon: 'success',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          background: '#ffffff',
          iconColor: '#4F46E5',
        });
        
        navigate('/dashboard');
      } catch (error) {
        console.error('Registration error:', error);
        
        let errorMessage = 'Registration failed. Please try again.';
        
        if (error.response?.data?.errors) {
          // Format Laravel validation errors
          errorMessage = Object.values(error.response.data.errors)
            .flat()
            .join(', ');
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
        
        setServerError(errorMessage);
        
        Swal.fire({
          title: 'Registration Failed',
          text: errorMessage,
          icon: 'error',
          confirmButtonText: 'Try Again',
          confirmButtonColor: '#4F46E5',
          background: '#ffffff',
        });
      }
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-primary-50 flex flex-col justify-center sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div 
          className="bg-white py-4 px-4 shadow-xl sm:rounded-lg sm:px-8 border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="sm:mx-auto sm:w-full sm:max-w-md mb-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-center text-xl font-extrabold text-gray-900">
              Create your account
            </h2>
            <p className="mt-1 text-center text-xs text-gray-600">
              Join LifeLog and transform your habits
            </p>
          </motion.div>

          {serverError && (
            <motion.div 
              className="rounded-md bg-red-50 p-2 mb-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-xs text-red-700">{serverError}</div>
            </motion.div>
          )}

          <form className="space-y-3" onSubmit={formik.handleSubmit}>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <label htmlFor="name" className="block text-xs font-medium text-gray-700">
                Your name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  className={`block w-full pl-9 pr-3 py-1.5 border ${
                    formik.touched.name && formik.errors.name
                      ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500'
                  } rounded-md shadow-sm text-sm`}
                  placeholder="John Doe"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.name && formik.errors.name && (
                <motion.p 
                  className="mt-1 text-xs text-red-600" 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {formik.errors.name}
                </motion.p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <label htmlFor="email" className="block text-xs font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MailIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className={`block w-full pl-9 pr-3 py-1.5 border ${
                    formik.touched.email && formik.errors.email
                      ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500'
                  } rounded-md shadow-sm text-sm`}
                  placeholder="you@example.com"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <motion.p 
                  className="mt-1 text-xs text-red-600" 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {formik.errors.email}
                </motion.p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <label htmlFor="password" className="block text-xs font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  className={`block w-full pl-9 pr-3 py-1.5 border ${
                    formik.touched.password && formik.errors.password
                      ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500'
                  } rounded-md shadow-sm text-sm`}
                  placeholder="••••••••"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.password && formik.errors.password && (
                <motion.p 
                  className="mt-1 text-xs text-red-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {formik.errors.password}
                </motion.p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <label htmlFor="passwordConfirmation" className="block text-xs font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="passwordConfirmation"
                  name="passwordConfirmation"
                  type="password"
                  autoComplete="new-password"
                  className={`block w-full pl-9 pr-3 py-1.5 border ${
                    formik.touched.passwordConfirmation && formik.errors.passwordConfirmation
                      ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500'
                  } rounded-md shadow-sm text-sm`}
                  placeholder="••••••••"
                  value={formik.values.passwordConfirmation}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.passwordConfirmation && formik.errors.passwordConfirmation && (
                <motion.p 
                  className="mt-1 text-xs text-red-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {formik.errors.passwordConfirmation}
                </motion.p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-2"
            >
              <button
                type="submit"
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition duration-300 ease-in-out"
                disabled={formik.isSubmitting}
              >
                {formik.isSubmitting ? 'Creating...' : 'Create account'}
                {!formik.isSubmitting && (
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                )}
              </button>
            </motion.div>
          </form>

          <motion.div 
            className="mt-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs sm:text-sm">
                <span className="px-2 bg-white text-gray-500">
                  <span className="hidden sm:inline">Already have an account?</span>
                  <span className="inline sm:hidden">Existing user?</span>
                </span>
              </div>
            </div>

            <div className="mt-3">
              <Link
                to="/login"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition duration-300 ease-in-out sm:text-sm md:py-2.5"
              >
                <span className="hidden sm:inline">Sign in instead</span>
                <span className="inline sm:hidden">Sign in</span>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;