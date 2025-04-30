// src/pages/HabitFormPage.js
import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import AddHabit from '../components/habits/AddHabit';
import EditHabit from '../components/habits/EditHabit';

const HabitFormPage = () => {
  const { id } = useParams();
  
  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {id ? <EditHabit /> : <AddHabit />}
      </div>
    </Layout>
  );
};

export default HabitFormPage;