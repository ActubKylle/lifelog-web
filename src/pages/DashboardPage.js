// src/pages/DashboardPage.js
import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../components/layout/Layout';
import HabitList from '../components/habits/HabitList';
import { useAuth } from '../contexts/AuthContext';
import habitService from '../services/habitService';
import { FiCheckCircle, FiTrendingUp, FiCalendar, FiActivity } from 'react-icons/fi';

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalHabits: 0,
    completedToday: 0,
    pendingToday: 0,
    longestStreak: 0
  });
  
  // Calculate stats based on habits data - extracted to reusable function
  const calculateStats = useCallback((habitsData) => {
    const today = new Date().toISOString().split('T')[0];
    
    const completedToday = habitsData.filter(habit => 
      habit.check_ins.some(checkIn => 
        checkIn.date.split('T')[0] === today && checkIn.status === true
      )
    ).length;
    
    const longestStreak = habitsData.reduce((max, habit) => 
      habit.current_streak > max ? habit.current_streak : max, 0);
    
    return {
      totalHabits: habitsData.length,
      completedToday,
      pendingToday: habitsData.length - completedToday,
      longestStreak
    };
  }, []);
  
  // Fetch habits data - extracted as a reusable function that can be passed to child
  const fetchHabits = useCallback(async () => {
    try {
      setLoading(true);
      const data = await habitService.getAllHabits();
      setHabits(data);
      
      // Calculate stats based on fetched data
      const newStats = calculateStats(data);
      setStats(newStats);
      
      setLoading(false);
      return data; // Return data for potential chaining
    } catch (err) {
      console.error('Error fetching habits:', err);
      setError('Failed to load habits. Please try again.');
      setLoading(false);
      return []; // Return empty array on error
    }
  }, [calculateStats]);
  
  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);
  
  // Utility functions
  const formatDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString(undefined, options);
  };
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };
  
  // Handler for habit updates from child component
  const onHabitsUpdated = useCallback((updatedHabits) => {
    setHabits(updatedHabits);
    const newStats = calculateStats(updatedHabits);
    setStats(newStats);
  }, [calculateStats]);
  
  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="pb-5 border-b border-gray-200 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {getGreeting()}, <span className="text-primary-600">{currentUser?.name || 'User'}</span>!
          </h1>
          <p className="mt-1 text-sm text-gray-500">{formatDate()}</p>
        </div>
        
        {!loading && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {/* Total Habits Widget */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                    <FiCalendar className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Habits
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {stats.totalHabits}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Completed Today Widget */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                    <FiCheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Completed Today
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {stats.completedToday}
                        </div>
                        {stats.totalHabits > 0 && (
                          <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                            {Math.round((stats.completedToday / stats.totalHabits) * 100)}%
                          </div>
                        )}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Pending Today Widget */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                    <FiActivity className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Pending Today
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {stats.pendingToday}
                        </div>
                        {stats.pendingToday === 0 && stats.totalHabits > 0 && (
                          <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                            All done!
                          </div>
                        )}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Longest Streak Widget */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                    <FiTrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Longest Streak
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {stats.longestStreak}
                        </div>
                        <div className="ml-2 flex items-baseline text-sm font-semibold text-gray-500">
                          days
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Pass data and handlers to child component */}
        <HabitList 
          initialHabits={habits}
          loading={loading}
          error={error}
          onHabitsUpdated={onHabitsUpdated}
          refreshHabits={fetchHabits}
        />
      </div>
    </Layout>
  );
};

export default DashboardPage;