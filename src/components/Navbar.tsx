import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Activity, Sun, Moon } from 'lucide-react';
import { useThemeContext } from '../context/ThemeContext';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { isDarkMode, toggleTheme } = useThemeContext();

  return (
    <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl lg:max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 transition-colors duration-200"
              onClick={onMenuClick}
            >
              <span className="sr-only">Open sidebar</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="flex-shrink-0 flex items-center mx-4">
              <Link to="/" className="flex items-center">
                <Activity className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                <span className="ml-2 text-xl font-bold text-primary-800 dark:text-primary-300">HealthTrack</span>
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="rounded-full p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors duration-200"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
            <div className="relative">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-primary-600 dark:bg-primary-500 flex items-center justify-center text-white font-medium">
                  DR
                </div>
                <span className="ml-2 text-sm font-medium text-slate-700 dark:text-slate-300 hidden md:block">
                  Dr. Rivera
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;