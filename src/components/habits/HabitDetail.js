// src/components/habits/HabitDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {FiArchive, FiEdit2, FiArrowLeft, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import habitService from '../../services/habitService';
import checkInService from '../../services/checkInService';
import { toast } from 'react-toastify';
// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const HabitDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [habit, setHabit] = useState(null);
  const [checkIns, setCheckIns] = useState([]);
  const [streakData, setStreakData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHabitData = async () => {
      try {
        // Get habit details with check-ins
        const habitData = await habitService.getHabit(id);
        setHabit(habitData);
        setCheckIns(habitData.check_ins);

        // Get streak data for charts
        const streakResponse = await habitService.getStreakData(id);
        setStreakData(streakResponse.streak_data);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching habit data:', err);
        setError('Failed to load habit data. Please try again.');
        setLoading(false);
      }
    };

    fetchHabitData();
  }, [id]);

  const prepareChartData = () => {
    // Prepare data for Chart.js
    const labels = streakData.map(item => item.month);
    const completedData = streakData.map(item => item.completed);
    const missedData = streakData.map(item => item.missed);

    return {
      labels,
      datasets: [
        {
          label: 'Completed',
          data: completedData,
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.5)',
        },
        {
          label: 'Missed',
          data: missedData,
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.5)',
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Progress',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0, // Only show integers
        },
      },
    },
  };

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

  if (!habit) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <p>Habit not found</p>
      </div>
    );
  }

  const handleArchive = async () => {
    if (window.confirm('Are you sure you want to archive this habit? It will be removed from your active habits.')) {
      try {
        const loadingToastId = toast.loading("Archiving habit...");
        
        console.log('Archiving habit ID:', id);
        await habitService.archiveHabit(id);
        
        toast.dismiss(loadingToastId);
        toast.success("Habit archived successfully!");
        
        // Navigate back to dashboard
        navigate('/dashboard');
      } catch (err) {
        console.error('Error archiving habit:', err);
        toast.error("Failed to archive habit. Please try again.");
      }
    }
  };
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
  <div className="flex items-center">
    <Link to="/dashboard" className="text-gray-500 hover:text-gray-700 mr-4">
      <FiArrowLeft className="h-5 w-5" />
    </Link>
    <h2 className="text-2xl font-bold text-gray-900">{habit.name}</h2>
  </div>
  <div className="flex space-x-2">
    <Link to={`/habits/${habit.id}/edit`} className="btn btn-secondary">
      <FiEdit2 className="inline-block mr-2" />
      Edit
    </Link>
    <button 
      onClick={handleArchive}
      className="btn btn-secondary"
    >
      <FiArchive className="inline-block mr-2" />
      Archive
    </button>
  </div>
</div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Details</h3>
          <p className="text-gray-500">Goal: {habit.goal} days</p>
          <p className="text-gray-500">Frequency: {habit.frequency}</p>
          <p className="text-gray-500">Status: {habit.is_active ? 'Active' : 'Inactive'}</p>
          
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
            <span>Progress</span>
              <span>{habit.progress_percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full" 
                style={{ width: `${habit.progress_percentage}%` }}
              ></div>
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700">Current streak: {habit.current_streak} days</p>
          </div>
        </div>
        
        <div className="card md:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Progress Chart</h3>
          {streakData.length > 0 ? (
            <Line data={prepareChartData()} options={chartOptions} />
          ) : (
            <p className="text-gray-500">No data available yet. Start tracking your habit to see progress.</p>
          )}
        </div>
      </div>
      
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Check-in History</h3>
        </div>
        
        {checkIns.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {checkIns.map((checkIn) => (
                  <tr key={checkIn.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(checkIn.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {checkIn.status ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          <FiCheckCircle className="mr-1 h-4 w-4" /> Completed
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          <FiXCircle className="mr-1 h-4 w-4" /> Missed
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {checkIn.notes || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No check-ins recorded yet.</p>
        )}
      </div>
    </div>
  );
};

export default HabitDetail;