// src/components/habits/EditHabit.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import habitService from '../../services/habitService';

const EditHabit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formik = useFormik({
    initialValues: {
      name: '',
      goal: 30,
      frequency: 'daily',
      is_active: true,
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required('Habit name is required')
        .max(255, 'Habit name must be 255 characters or less'),
      goal: Yup.number()
        .required('Goal is required')
        .integer('Goal must be a whole number')
        .min(1, 'Goal must be at least 1'),
      frequency: Yup.string()
        .required('Frequency is required')
        .oneOf(['daily', 'weekly'], 'Invalid frequency'),
      is_active: Yup.boolean(),
    }),
    onSubmit: async (values) => {
      try {
        await habitService.updateHabit(id, values);
        navigate('/dashboard');
      } catch (error) {
        console.error('Error updating habit:', error);
        formik.setStatus('Failed to update habit. Please try again.');
      }
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    const fetchHabit = async () => {
      try {
        const habit = await habitService.getHabit(id);
        formik.setValues({
          name: habit.name,
          goal: habit.goal,
          frequency: habit.frequency,
          is_active: habit.is_active,
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching habit:', err);
        setError('Failed to load habit. Please try again.');
        setLoading(false);
      }
    };

    fetchHabit();
  }, [id]);

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
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Habit</h2>

      {formik.status && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          <p>{formik.status}</p>
        </div>
      )}

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="form-label">
            Habit Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className={`form-input ${
              formik.touched.name && formik.errors.name ? 'border-red-300' : ''
            }`}
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.name && formik.errors.name && (
            <div className="form-error">{formik.errors.name}</div>
          )}
        </div>

        <div>
          <label htmlFor="goal" className="form-label">
            Goal (Days)
          </label>
          <input
            id="goal"
            name="goal"
            type="number"
            min="1"
            className={`form-input ${
              formik.touched.goal && formik.errors.goal ? 'border-red-300' : ''
            }`}
            value={formik.values.goal}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.goal && formik.errors.goal && (
            <div className="form-error">{formik.errors.goal}</div>
          )}
          <p className="text-sm text-gray-500 mt-1">
            Number of days you want to maintain this habit
          </p>
        </div>

        <div>
          <label htmlFor="frequency" className="form-label">
            Frequency
          </label>
          <select
            id="frequency"
            name="frequency"
            className={`form-input ${
              formik.touched.frequency && formik.errors.frequency
                ? 'border-red-300'
                : ''
            }`}
            value={formik.values.frequency}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
          {formik.touched.frequency && formik.errors.frequency && (
            <div className="form-error">{formik.errors.frequency}</div>
          )}
        </div>

        <div className="flex items-center">
          <input
            id="is_active"
            name="is_active"
            type="checkbox"
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            checked={formik.values.is_active}
            onChange={formik.handleChange}
          />
          <label htmlFor="is_active" className="ml-2 block text-gray-700">
            Active
          </label>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/dashboard')}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditHabit;