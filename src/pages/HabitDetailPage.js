import React from 'react';
import Layout from '../components/layout/Layout';
import HabitDetail from '../components/habits/HabitDetail';

const HabitDetailPage = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <HabitDetail />
      </div>
    </Layout>
  );
};

export default HabitDetailPage;