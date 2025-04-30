// src/services/checkInService.js
import { api } from './authService';
import { toast } from 'react-toastify';

const checkInService = {
  // Get check-ins for a specific habit
  getCheckInsForHabit: async (habitId) => {
    try {
      const response = await api.get('/checkins', {
        params: { habit_id: habitId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching check-ins:', error);
      throw error;
    }
  },
  
  // Get a specific check-in by ID
  getCheckIn: async (id) => {
    try {
      const response = await api.get(`/checkins/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching check-in details:', error);
      throw error;
    }
  },
  
  // Create a new check-in with improved error handling and notes support
  createCheckIn: async (checkInData) => {
    try {
      // Log the check-in data for debugging
      console.log('Creating check-in with data:', checkInData);
      
      const response = await api.post('/checkins', checkInData);
      return response.data;
    } catch (error) {
      // Handle 409 conflict (already checked in today) more specifically
      if (error.response?.status === 409) {
        console.log('Check-in already exists for today:', error.response.data);
        throw error; // Let the component handle this specific error
      }
      
      // For any other API errors
      let errorMessage = "Failed to create check-in";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }
      
      console.error('Check-in creation error:', errorMessage, error);
      toast.error(errorMessage);
      throw error;
    }
  },
  
  // Update an existing check-in with better error handling and notes support
  updateCheckIn: async (id, checkInData) => {
    try {
      console.log('Updating check-in', id, checkInData); // Debug log
      
      const response = await api.put(`/checkins/${id}`, checkInData);
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to update check-in";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }
      
      console.error('Error in updateCheckIn:', errorMessage, error);
      toast.error(errorMessage);
      throw error;
    }
  },
  
  // Delete a check-in
  deleteCheckIn: async (id) => {
    try {
      const response = await api.delete(`/checkins/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting check-in:', error);
      throw error;
    }
  },
  
  // New method to get the check-in status for a specific day
  getCheckInForDate: async (habitId, date) => {
    try {
      const allCheckIns = await checkInService.getCheckInsForHabit(habitId);
      return allCheckIns.find(checkIn => checkIn.date === date) || null;
    } catch (error) {
      console.error('Error getting check-in for date:', error);
      throw error;
    }
  }
};

export default checkInService;