import React from 'react';

interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Loading...', 
  size = 'medium' 
}) => {
  const sizeClasses = {
    small: 'h-6 w-6 border-2',
    medium: 'h-10 w-10 border-2',
    large: 'h-16 w-16 border-3',
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className={`animate-spin rounded-full ${sizeClasses[size]} border-t-transparent border-primary-600 dark:border-primary-500 mb-4`}></div>
      {message && <p className="text-slate-600 dark:text-slate-400">{message}</p>}
    </div>
  );
};

export default LoadingState;