// src/pages/ArchivedHabitsPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiRefreshCw, FiTrash2 } from 'react-icons/fi';
import habitService from '../services/habitService';
import Layout from '../components/layout/Layout';

// Debug log
console.log('Standalone ArchivedHabitsPage component is being loaded');

const ArchivedHabitsPage = () => {
  console.log('Standalone ArchivedHabitsPage component is rendering');
  
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchArchivedHabits();
  }, []);
  
  const fetchArchivedHabits = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching archived habits...");
      
      const data = await habitService.getArchivedHabits();
      console.log("Archived habits data:", data);
      
      setHabits(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching archived habits:', err);
      setError('Failed to load archived habits. Please try again.');
      setLoading(false);
    }
  };
  
  const handleUnarchive = async (habitId) => {
    try {
      const loadingToastId = toast.loading("Restoring habit...");
      
      console.log("Unarchiving habit ID:", habitId);
      await habitService.unarchiveHabit(habitId);
      
      toast.dismiss(loadingToastId);
      toast.success("Habit restored successfully!");
      
      // Remove the unarchived habit from the list
      setHabits(habits.filter(habit => habit.id !== habitId));
    } catch (err) {
      console.error('Error unarchiving habit:', err);
      toast.error("Failed to restore habit. Please try again.");
    }
  };
  
  const handleDeleteHabit = async (habitId) => {
    if (window.confirm('Are you sure you want to permanently delete this habit? This action cannot be undone.')) {
      try {
        const loadingToastId = toast.loading("Permanently deleting habit...");
        
        console.log("Permanently deleting habit ID:", habitId);
        await habitService.deleteHabit(habitId);
        
        toast.dismiss(loadingToastId);
        toast.success("Habit permanently deleted");
        
        // Remove the deleted habit from the state
        setHabits(habits.filter(habit => habit.id !== habitId));
      } catch (err) {
        console.error('Error permanently deleting habit:', err);
        toast.error("Failed to delete habit. Please try again.");
      }
    }
  };
  
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <button 
            onClick={fetchArchivedHabits}
            className="mt-2 bg-red-100 text-red-800 px-3 py-1 rounded text-sm"
          >
            Try Again
          </button>
        </div>
      );
    }
    
    if (!habits || habits.length === 0) {
      return (
        <div className="space-y-6">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-gray-500 hover:text-gray-700 mr-4">
              <FiArrowLeft className="h-5 w-5" />
            </Link>
            <h2 className="text-2xl font-bold text-gray-900">Archived Habits</h2>
          </div>
          
          <div className="text-center py-12">
            <div className="mx-auto w-40 h-40 mb-6 text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No archived habits</h3>
            <p className="text-gray-500 mb-6">You haven't archived any habits yet.</p>
            <Link to="/dashboard" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              <FiArrowLeft className="mr-2 -ml-1 h-5 w-5" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        <div className="flex items-center mb-6">
          <Link to="/dashboard" className="text-gray-500 hover:text-gray-700 mr-4">
            <FiArrowLeft className="h-5 w-5" />
          </Link>
          <h2 className="text-2xl font-bold text-gray-900">Archived Habits</h2>
        </div>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {habits.map(habit => (
            <div key={habit.id} className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
              <div className="px-4 py-5 sm:px-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium text-gray-900 truncate">{habit.name}</h3>
                  <div>
                    <button
                      onClick={() => handleDeleteHabit(habit.id)}
                      className="text-gray-400 hover:text-red-500"
                      title="Delete Permanently"
                    >
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Goal: {habit.goal} days ({habit.frequency})
                  </p>
                  {habit.current_streak > 0 && (
                    <p className="text-sm text-gray-500 mt-2">
                      Final streak: {habit.current_streak} days
                    </p>
                  )}
                </div>
              </div>
              
              <div className="px-4 py-4 sm:px-6">
                <button
                  onClick={() => handleUnarchive(habit.id)}
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200"
                >
                  <FiRefreshCw className="mr-2 h-4 w-4" />
                  Restore Habit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {renderContent()}
      </div>
    </Layout>
  );
};

export default ArchivedHabitsPage;