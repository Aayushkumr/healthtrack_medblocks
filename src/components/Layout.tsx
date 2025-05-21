import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.tsx';
import Sidebar from './Sidebar.tsx';
import DatabaseStatus from './DatabaseStatus.tsx';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col transition-colors duration-200">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 dark:bg-slate-900 p-4 md:p-6 lg:p-8 transition-colors duration-200">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      <DatabaseStatus />
      </div>
    </div>
  );
};
export default Layout;