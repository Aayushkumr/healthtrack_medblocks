// src/pages/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDatabaseContext } from '../context/DatabaseContext';
import { getAllPatients } from '../services/DatabaseService';
import { UserPlus, Search, Users, Database } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { isLoading, isInitialized, error } = useDatabaseContext();
  const [patientCount, setPatientCount] = useState<number>(0);

  useEffect(() => {
    const loadData = async () => {
      if (isInitialized) {
        try {
          const patients = await getAllPatients();
          setPatientCount(patients.length);
        } catch (err) {
          console.error('Error loading dashboard data:', err);
        }
      }
    };

    loadData();
  }, [isInitialized]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-600 p-4 rounded-md">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-red-800 dark:text-red-300 font-medium">Database Error</h3>
            <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-transition">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Welcome to HealthTrack, your patient management system
        </p>
      </header>

      <div className="mb-8">
        <div className="bg-white dark:bg-slate-800 overflow-hidden shadow rounded-lg transition-colors duration-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-primary-100 dark:bg-primary-900/50 rounded-md p-3">
                <Users className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">Total Patients</dt>
                  <dd>
                    <div className="text-lg font-medium text-slate-900 dark:text-white">{patientCount}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/60 px-5 py-3 flex items-center justify-between border-t border-slate-200 dark:border-slate-700">
            <div className="text-sm text-slate-500 dark:text-slate-400">Updated just now</div>
            <Link 
              to="/patients" 
              className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500"
            >
              View all
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Register Patients Card */}
        <div className="card card-hover group">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-accent-100 dark:bg-accent-900/50 rounded-md p-3 group-hover:bg-accent-200 dark:group-hover:bg-accent-800/50 transition-colors">
                <UserPlus className="h-6 w-6 text-accent-600 dark:text-accent-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <h3 className="text-base font-medium text-slate-900 dark:text-white">Register New Patient</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Add a new patient to the system with complete details
                </p>
              </div>
            </div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/60 px-5 py-3 border-t border-slate-200 dark:border-slate-700 group-hover:bg-slate-100 dark:group-hover:bg-slate-700/50 transition-colors">
            <Link
              to="/register"
              className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 group-hover:translate-x-0.5 inline-flex items-center transform transition-transform"
            >
              Register Patient 
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Query Patients Card */}
        <div className="card card-hover group">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-secondary-100 dark:bg-secondary-900/50 rounded-md p-3 group-hover:bg-secondary-200 dark:group-hover:bg-secondary-800/50 transition-colors">
                <Search className="h-6 w-6 text-secondary-600 dark:text-secondary-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <h3 className="text-base font-medium text-slate-900 dark:text-white">Query Database</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Execute custom SQL queries to analyze patient data
                </p>
              </div>
            </div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/60 px-5 py-3 border-t border-slate-200 dark:border-slate-700 group-hover:bg-slate-100 dark:group-hover:bg-slate-700/50 transition-colors">
            <Link
              to="/query"
              className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 group-hover:translate-x-0.5 inline-flex items-center transform transition-transform"
            >
              Open Query Tool 
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Database Info Card */}
        <div className="card card-hover group">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 dark:bg-green-900/50 rounded-md p-3 group-hover:bg-green-200 dark:group-hover:bg-green-800/50 transition-colors">
                <Database className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <h3 className="text-base font-medium text-slate-900 dark:text-white">Database Status</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  PostgreSQL running in your browser with PGlite
                </p>
              </div>
            </div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/60 px-5 py-3 border-t border-slate-200 dark:border-slate-700 group-hover:bg-slate-100 dark:group-hover:bg-slate-700/50 transition-colors">
            <div className="text-sm font-medium text-green-600 dark:text-green-400">
              Connected • Data stored locally
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;