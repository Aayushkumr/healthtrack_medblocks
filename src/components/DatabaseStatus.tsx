import React from 'react';
import { useDatabaseContext } from '../context/DatabaseContext';

const DatabaseStatus: React.FC = () => {
  const { isLoading, isInitialized, error } = useDatabaseContext();
  
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white dark:bg-slate-800 shadow-md rounded-lg p-3 text-xs">
      <div className="flex items-center">
        <div className={`w-2 h-2 rounded-full mr-2 ${
          error ? 'bg-red-500' : 
          isInitialized ? 'bg-green-500' : 
          isLoading ? 'bg-yellow-500 animate-pulse' : 
          'bg-gray-500'
        }`}></div>
        <span>
          {error ? 'Database Error' : 
           isLoading ? 'Loading Database...' : 
           isInitialized ? 'Database Connected' : 
           'Not Initialized'}
        </span>
      </div>
      {error && <div className="mt-1 text-red-500 max-w-xs truncate">{error}</div>}
    </div>
  );
};

export default DatabaseStatus;