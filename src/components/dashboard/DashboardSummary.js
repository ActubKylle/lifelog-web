// import React from 'react';
// import { FiCheckSquare, FiClock, FiAward, FiCalendar } from 'react-icons/fi';

// const DashboardSummary = ({ habits }) => {
//   const totalHabits = habits.length;
//   const completedToday = habits.filter(habit => 
//     habit.check_ins.some(checkIn => 
//       checkIn.date === new Date().toISOString().split('T')[0] && checkIn.status === true
//     )
//   ).length;
  
//   const pendingToday = totalHabits - completedToday;
  
//   const longestStreak = habits.reduce((max, habit) => 
//     habit.current_streak > max ? habit.current_streak : max, 0);
  
//   return (
//     <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
//       <div className="bg-white overflow-hidden shadow rounded-lg">
//         <div className="px-4 py-5 sm:p-6">
//           <div className="flex items-center">
//             <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
//               <FiCheckSquare className="h-6 w-6 text-primary-600" />
//             </div>
//             <div className="ml-5 w-0 flex-1">
//               <dl>
//                 <dt className="text-sm font-medium text-gray-500 truncate">
//                   Total Habits
//                 </dt>
//                 <dd>
//                   <div className="text-lg font-medium text-gray-900">{totalHabits}</div>
//                 </dd>
//               </dl>
//             </div>
//           </div>
//         </div>
//       </div>
      
//       <div className="bg-white overflow-hidden shadow rounded-lg">
//         <div className="px-4 py-5 sm:p-6">
//           <div className="flex items-center">
//             <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
//               <FiCheckSquare className="h-6 w-6 text-green-600" />
//             </div>
//             <div className="ml-5 w-0 flex-1">
//               <dl>
//                 <dt className="text-sm font-medium text-gray-500 truncate">
//                   Completed Today
//                 </dt>
//                 <dd>
//                   <div className="text-lg font-medium text-gray-900">{completedToday}</div>
//                 </dd>
//               </dl>
//             </div>
//           </div>
//         </div>
//       </div>
      
//       <div className="bg-white overflow-hidden shadow rounded-lg">
//         <div className="px-4 py-5 sm:p-6">
//           <div className="flex items-center">
//             <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
//               <FiClock className="h-6 w-6 text-yellow-600" />
//             </div>
//             <div className="ml-5 w-0 flex-1">
//               <dl>
//                 <dt className="text-sm font-medium text-gray-500 truncate">
//                   Pending Today
//                 </dt>
//                 <dd>
//                   <div className="text-lg font-medium text-gray-900">{pendingToday}</div>
//                 </dd>
//               </dl>
//             </div>
//           </div>
//         </div>
//       </div>
      
//       <div className="bg-white overflow-hidden shadow rounded-lg">
//         <div className="px-4 py-5 sm:p-6">
//           <div className="flex items-center">
//             <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
//               <FiAward className="h-6 w-6 text-purple-600" />
//             </div>
//             <div className="ml-5 w-0 flex-1">
//               <dl>
//                 <dt className="text-sm font-medium text-gray-500 truncate">
//                   Longest Streak
//                 </dt>
//                 <dd>
//                   <div className="text-lg font-medium text-gray-900">{longestStreak} days</div>
//                 </dd>
//               </dl>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardSummary;