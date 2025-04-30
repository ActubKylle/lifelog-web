// src/components/habits/HabitList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlusCircle, FiEdit2, FiArchive, FiCheckCircle, FiXCircle, FiMessageSquare } from 'react-icons/fi';
import { toast } from 'react-toastify';
import habitService from '../../services/habitService';
import checkInService from '../../services/checkInService';
import { showToast } from '../../services/toastService';
import { confirmAction } from '../../services/confirmService';
import SuccessConfetti from './SuccessConfetti';

const HabitList = ({
  // New props for better data flow
  initialHabits = [], 
  loading: parentLoading = false, 
  error: parentError = null,
  onHabitsUpdated = () => {},
  refreshHabits = null
}) => {
  // Use provided data or maintain local state if none provided
  const [habits, setHabits] = useState(initialHabits);
  const [loading, setLoading] = useState(parentLoading);
  const [error, setError] = useState(parentError);
  const [showConfetti, setShowConfetti] = useState(false);
  const [noteInputs, setNoteInputs] = useState({});
  const [hasPendingCheckIns, setHasPendingCheckIns] = useState(false);
  
  // Use parent data when it updates
  useEffect(() => {
    if (initialHabits.length > 0) {
      setHabits(initialHabits);
      checkForPendingCheckIns(initialHabits);
    }
  }, [initialHabits]);
  
  useEffect(() => {
    setLoading(parentLoading);
  }, [parentLoading]);
  
  useEffect(() => {
    setError(parentError);
  }, [parentError]);
  
  // Function to check if there are any pending check-ins
  const checkForPendingCheckIns = (habitsData) => {
    const today = new Date().toISOString().split('T')[0]; // Format: "2025-04-30"
    const pendingCheckIns = habitsData.some(habit => {
      // If the habit has no check-ins for today, it's pending
      return !habit.check_ins.some(checkIn => {
        // Extract just the date part for comparison
        const checkInDate = checkIn.date.split('T')[0];
        return checkInDate === today;
      });
    });
    
    setHasPendingCheckIns(pendingCheckIns);
  };
  
  // Only load habits if not provided by parent
  useEffect(() => {
    const fetchHabits = async () => {
      // Skip fetching if parent provided data
      if (initialHabits.length > 0) {
        return;
      }
      
      try {
        setLoading(true);
        const data = await habitService.getAllHabits();
        setHabits(data);
        checkForPendingCheckIns(data);
        setLoading(false);
        
        // Notify parent about data update
        onHabitsUpdated(data);
      } catch (err) {
        console.error('Error fetching habits:', err);
        setError('Failed to load habits. Please try again.');
        setLoading(false);
      }
    };
    
    fetchHabits();
  }, []);
  
  const handleNoteChange = (habitId, value) => {
    setNoteInputs(prev => ({
      ...prev,
      [habitId]: value
    }));
  };
  
  const handleCheckIn = async (habitId, status) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const note = noteInputs[habitId] || '';
      const loadingToastId = toast.loading(status ? "Marking as completed..." : "Marking as missed...");
      
      try {
        await checkInService.createCheckIn({
          habit_id: habitId,
          date: today,
          status,
          notes: note
        });
        
        toast.dismiss(loadingToastId);
        showToast.success(status ? 
          "Habit marked as completed for today! 🎉" : 
          "Habit marked as missed for today. Keep trying!"
        );
        
        setNoteInputs(prev => ({
          ...prev,
          [habitId]: ''
        }));
        
        if (status) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 3000);
        }
        
        // Use parent provided refresh function if available
        if (refreshHabits) {
          const updatedHabits = await refreshHabits();
          // Parent function handles state updates, no need to set here
          checkForPendingCheckIns(updatedHabits || habits);
        } else {
          // Fallback to direct API call if no parent refresh function
          const updatedHabits = await habitService.getAllHabits();
          setHabits(updatedHabits);
          checkForPendingCheckIns(updatedHabits);
          // Notify parent about data update
          onHabitsUpdated(updatedHabits);
        }
      } catch (err) {
        console.error('Error creating check-in:', err);
        
        // If a check-in already exists for today, update it
        if (err.response?.status === 409) {
          try {
            const existingCheckIn = err.response.data.check_in;
            
            await checkInService.updateCheckIn(existingCheckIn.id, { 
              status,
              notes: note
            });
            
            toast.dismiss(loadingToastId);
            showToast.success(status ? 
              "Updated today's check-in to completed! 🎉" : 
              "Updated today's check-in to missed."
            );
            
            setNoteInputs(prev => ({
              ...prev,
              [habitId]: ''
            }));
            
            if (status) {
              setShowConfetti(true);
              setTimeout(() => setShowConfetti(false), 3000);
            }
            
            // Use parent provided refresh function if available
            if (refreshHabits) {
              const updatedHabits = await refreshHabits();
              checkForPendingCheckIns(updatedHabits || habits);
            } else {
              // Fallback to direct API call if no parent refresh function
              const updatedHabits = await habitService.getAllHabits();
              setHabits(updatedHabits);
              checkForPendingCheckIns(updatedHabits);
              // Notify parent about data update
              onHabitsUpdated(updatedHabits);
            }
          } catch (updateErr) {
            console.error('Error updating check-in:', updateErr);
            toast.dismiss(loadingToastId);
            showToast.error("Failed to update check-in. Please try again.");
          }
        } else {
          toast.dismiss(loadingToastId);
          
          let errorMessage = "Failed to record check-in. Please try again.";
          
          if (err.response?.data?.message) {
            errorMessage = err.response.data.message;
          } else if (err.message) {
            errorMessage = `Error: ${err.message}`;
          }
          
          showToast.error(errorMessage);
        }
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      showToast.error("Something went wrong. Please try again.");
    }
  };
  
  const handleArchiveHabit = async (habitId) => {
    const result = await confirmAction.delete(
      'Archive Habit', 
      'Are you sure you want to archive this habit? You can restore it later from the Archived Habits section.'
    );
    
    if (result.isConfirmed) {
      try {
        const loadingToastId = toast.loading("Archiving habit...");
        
        await habitService.archiveHabit(habitId);
        
        toast.dismiss(loadingToastId);
        showToast.success("Habit successfully archived");
        
        // Remove the archived habit from the local state
        const updatedHabits = habits.filter(habit => habit.id !== habitId);
        setHabits(updatedHabits);
        checkForPendingCheckIns(updatedHabits);
        
        // Notify parent about data update
        onHabitsUpdated(updatedHabits);
      } catch (err) {
        console.error('Error archiving habit:', err);
        showToast.error("Failed to archive habit. Please try again.");
      }
    }
  };
  
  // Enhanced function to calculate progress percentage
  const getProgressPercentage = (habit) => {
    if (!habit || !habit.goal || typeof habit.goal !== 'number') {
      return 0;
    }
    
    // Calculate it based on actual completed check-ins
    const completedCheckIns = habit.check_ins ? 
      habit.check_ins.filter(checkIn => checkIn.status === true).length : 0;
    
    // Calculate exact percentage based on completed check-ins vs goal
    const percentage = (completedCheckIns / habit.goal) * 100;
    
    // Return a precise percentage with 1 decimal point for display, capped at 100%
    return Math.min(Math.round(percentage * 10) / 10, 100);
  };
  
  // Header section with title and action buttons
  const HeaderSection = () => (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-gray-900">My Habits</h2>
      <div className="flex space-x-2">
        <Link to="/habits/archived" className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <FiArchive className="mr-2 -ml-0.5 h-4 w-4" />
          Archived Habits
        </Link>
        <Link to="/habits/create" className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
          <FiPlusCircle className="mr-2 -ml-0.5 h-4 w-4" />
          Create Habit
        </Link>
      </div>
    </div>
  );
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div>
        <HeaderSection />
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }
  
  if (habits.length === 0) {
    return (
      <div>
        <HeaderSection />
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <div className="mx-auto w-40 h-40 mb-6 text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No habits yet</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Create your first habit to start tracking your progress towards your goals.
          </p>
          <Link to="/habits/create" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
            <FiPlusCircle className="mr-2 -ml-1 h-5 w-5" />
            Create Your First Habit
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <HeaderSection />
      
      {hasPendingCheckIns && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
          <p>You have habits that need to be checked in today!</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {habits.map(habit => {
          // Check if there's a check-in for today
          const today = new Date().toISOString().split('T')[0];
          const todayCheckIn = habit.check_ins.find(checkIn => {
            // Extract just the date part for comparison
            return checkIn.date.split('T')[0] === today;
          });
          const hasCheckedIn = !!todayCheckIn;
          
          // Calculate progress percentage accurately for this habit
          const progressPercentage = getProgressPercentage(habit);
          const completedCheckIns = habit.check_ins ? 
            habit.check_ins.filter(checkIn => checkIn.status === true).length : 0;
          
          // Calculate progress step (how much each check-in contributes to overall progress)
          const progressStep = habit.goal > 0 ? (100 / habit.goal) : 0;
          
          return (
            <div key={habit.id} className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
              <div className="px-4 py-5 sm:px-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium text-gray-900 truncate">{habit.name}</h3>
                  <div className="flex space-x-2">
                    <Link 
                      to={`/habits/${habit.id}/edit`}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <FiEdit2 className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => handleArchiveHabit(habit.id)}
                      className="text-gray-400 hover:text-indigo-500"
                    >
                      <FiArchive className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Goal: {habit.goal} days ({habit.frequency})
                  </p>
                  <div className="mt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>
                        {completedCheckIns} of {habit.goal} days ({progressPercentage.toFixed(1)}%)
                        {progressStep > 0 && (
                          <span className="text-xs text-gray-500 ml-1">
                            (+{progressStep.toFixed(1)}% per check-in)
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full transition-all duration-500 ease-in-out" 
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Current streak: {habit.current_streak} days
                  </p>
                </div>
              </div>
              
              <div className="px-4 py-4 sm:px-6">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between">
                    <Link 
                      to={`/habits/${habit.id}`}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      View Details
                    </Link>
                    
                    <div className="flex space-x-2">
                      {!hasCheckedIn ? (
                        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                          <button
                            onClick={() => handleCheckIn(habit.id, true)}
                            className="flex items-center justify-center px-3 py-2 rounded-md bg-green-100 text-green-600 hover:bg-green-200 transition-colors duration-150"
                            title="Mark as completed"
                          >
                            <FiCheckCircle className="h-5 w-5 mr-1" />
                            <span>Complete</span>
                          </button>
                          <button
                            onClick={() => handleCheckIn(habit.id, false)}
                            className="flex items-center justify-center px-3 py-2 rounded-md bg-red-100 text-red-600 hover:bg-red-200 transition-colors duration-150"
                            title="Mark as missed"
                          >
                            <FiXCircle className="h-5 w-5 mr-1" />
                            <span>Skip</span>
                          </button>
                        </div>
                      ) : (
                        <div className={`px-3 py-2 rounded-md ${
                          todayCheckIn.status 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          <div className="flex items-center">
                            {todayCheckIn.status 
                              ? <FiCheckCircle className="h-5 w-5 mr-2" /> 
                              : <FiXCircle className="h-5 w-5 mr-2" />
                            }
                            <span className="font-medium">
                              {todayCheckIn.status ? 'Completed today' : 'Missed today'}
                            </span>
                          </div>
                          <button 
                            onClick={() => handleCheckIn(habit.id, !todayCheckIn.status)}
                            className="text-xs underline mt-1 hover:text-gray-700"
                          >
                            Change to {todayCheckIn.status ? 'missed' : 'completed'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Note input for check-ins - only show when not checked in yet */}
                  {!hasCheckedIn && (
                    <div className="mt-2">
                      <div className="flex items-center mb-1">
                        <FiMessageSquare className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-xs text-gray-500">Add a note (optional)</span>
                      </div>
                      <textarea
                        value={noteInputs[habit.id] || ''}
                        onChange={(e) => handleNoteChange(habit.id, e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        placeholder="How did it go today? (optional)"
                        rows="2"
                      />
                    </div>
                  )}
                  
                  {/* Display existing note if checked in already */}
                  {hasCheckedIn && todayCheckIn.notes && (
                    <div className="mt-2 px-3 py-2 bg-gray-50 rounded-md">
                      <div className="flex items-center mb-1">
                        <FiMessageSquare className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-xs text-gray-500">Today's note:</span>
                      </div>
                      <p className="text-sm text-gray-700">{todayCheckIn.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {showConfetti && <SuccessConfetti />}
    </div>
  );
};

export default HabitList;