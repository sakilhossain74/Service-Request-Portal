import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="srp-shell">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="srp-content-wrap">
        <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
        <main className="portal-main flex-grow-1 page-fade-in">
          <div className="container-fluid px-3 px-md-4 srp-container">
            <Outlet />
          </div>
        </main>
        <footer className="portal-footer">
          Service Request &amp; Resolution Portal
        </footer>
      </div>
    </div>
  );
};

export default Layout;
