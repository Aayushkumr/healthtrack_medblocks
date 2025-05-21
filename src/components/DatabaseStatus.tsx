import React from 'react';
import { useDatabaseContext } from '../context/DatabaseContext';
import { Database } from 'lucide-react';

const DatabaseStatus: React.FC = () => {
  const { isLoading, isInitialized, error } = useDatabaseContext();
  
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white dark:bg-slate-800 shadow-md rounded-lg p-3 scale-in">
      <div className="flex items-center">
        <div className={`w-2 h-2 rounded-full mr-2 ${
          error ? 'bg-red-500' : 
          isInitialized ? 'bg-green-500' : 
          isLoading ? 'bg-yellow-500 animate-pulse' : 
          'bg-gray-500'
        }`}></div>
        <span className="mr-2 text-xs font-medium text-slate-700 dark:text-slate-300">
          {error ? 'Database Error' : 
           isLoading ? 'Loading Database...' : 
           isInitialized ? 'Database Connected' : 
           'Not Initialized'}
        </span>
        <Database className="h-3.5 w-3.5 text-slate-400" />
      </div>
      {error && (
        <div className="mt-1 text-xs text-red-500 max-w-xs truncate border-t border-slate-200 dark:border-slate-700 pt-1">
          {error}
        </div>
      )}
    </div>
  );
};

export default DatabaseStatus;