// src/services/habitService.js
import { api } from './authService';

const habitService = {
  // Get all habits for the current user
  getAllHabits: async () => {
    try {
      const response = await api.get('/habits');
      return response.data;
    } catch (error) {
      console.error('Error getting habits:', error.response || error);
      throw error;
    }
  },
  
  // Get a specific habit by ID
  getHabit: async (id) => {
    try {
      const response = await api.get(`/habits/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error getting habit:', error.response || error);
      throw error;
    }
  },
  
  // Create a new habit
  createHabit: async (habitData) => {
    try {
      const response = await api.post('/habits', habitData);
      return response.data;
    } catch (error) {
      console.error('Error creating habit:', error.response || error);
      throw error;
    }
  },
  
  // Update an existing habit
  updateHabit: async (id, habitData) => {
    try {
      const response = await api.put(`/habits/${id}`, habitData);
      return response.data;
    } catch (error) {
      console.error('Error updating habit:', error.response || error);
      throw error;
    }
  },
  
  // Delete a habit permanently
  deleteHabit: async (id) => {
    try {
      console.log('Permanently deleting habit:', id);
      const response = await api.delete(`/habits/${id}/force`);
      return response.data;
    } catch (error) {
      console.error('Error permanently deleting habit:', error.response || error);
      throw error;
    }
  },
  
  // Soft delete a habit (archive)
  archiveHabit: async (id) => {
    try {
      console.log('Archiving habit (soft delete):', id);
      const response = await api.delete(`/habits/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error archiving habit:', error.response || error);
      throw error;
    }
  },
  
  // Get archived habits (trashed) - FIXED: use 'trashed' endpoint, not 'archived'
  getArchivedHabits: async () => {
    try {
      console.log('Fetching trashed habits...');
      const response = await api.get('/habits/trashed');
      console.log('Trashed habits response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error getting archived habits:', error.response || error);
      throw error;
    }
  },
  
  // Restore an archived habit
  unarchiveHabit: async (id) => {
    try {
      console.log('Restoring habit:', id);
      const response = await api.post(`/habits/${id}/restore`);
      return response.data;
    } catch (error) {
      console.error('Error restoring habit:', error.response || error);
      throw error;
    }
  },
  
  // Get streak data for a habit
  getStreakData: async (id) => {
    try {
      const response = await api.get(`/habits/${id}/streak`);
      return response.data;
    } catch (error) {
      console.error('Error getting streak data:', error.response || error);
      throw error;
    }
  }
};

export default habitService;