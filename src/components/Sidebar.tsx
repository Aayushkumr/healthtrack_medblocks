import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, UserPlus, Search, Users, Database, X } from 'lucide-react';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && open) {
        onClose();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [open, onClose]);

  const navItems = [
    { to: '/', label: 'Dashboard', icon: <Home size={20} /> },
    { to: '/register', label: 'Register Patient', icon: <UserPlus size={20} /> },
    { to: '/query', label: 'Query Patients', icon: <Search size={20} /> },
    { to: '/patients', label: 'Patient List', icon: <Users size={20} /> },
  ];

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-slate-800 bg-opacity-75 md:hidden transition-opacity duration-300"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar for mobile */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-800 shadow-lg transform transition-transform duration-300 ease-in-out md:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200 dark:border-slate-700">
          <span className="text-xl font-bold text-primary-800 dark:text-primary-300">HealthTrack</span>
          <button
            type="button"
            className="rounded-md text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            onClick={onClose}
          >
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <nav className="mt-4 px-2 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 border-l-4 border-primary-600 dark:border-primary-400'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                }`
              }
              end={item.to === '/'}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
            <Database className="h-4 w-4 mr-2 text-secondary-600 dark:text-secondary-400" />
            Browser Database Active
          </div>
        </div>
      </div>

      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 transition-colors duration-200">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <nav className="mt-5 flex-1 px-2 bg-white dark:bg-slate-800 space-y-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                        isActive
                          ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 border-l-4 border-primary-600 dark:border-primary-400'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                      }`
                    }
                    end={item.to === '/'}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-slate-200 dark:border-slate-700 p-4">
              <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                <Database className="h-4 w-4 mr-2 text-secondary-600 dark:text-secondary-400" />
                Browser Database Active
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;