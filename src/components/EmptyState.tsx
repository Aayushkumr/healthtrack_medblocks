import React from 'react';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon, 
  title, 
  description, 
  action 
}) => {
  return (
    <div className="card flex flex-col items-center justify-center py-12 text-center">
      {icon && <div className="text-slate-300 dark:text-slate-600 mb-4">{icon}</div>}
      <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">{title}</h3>
      {description && <p className="text-slate-600 dark:text-slate-400 max-w-md mb-4">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
};

export default EmptyState;