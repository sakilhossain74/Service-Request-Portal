import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="min-vh-100 d-flex flex-column">
      <Navbar />
      <main className="container py-4 flex-grow-1">
        <Outlet />
      </main>
      <footer className="bg-white border-top py-3 text-center text-muted small">
        Service Request &amp; Resolution Portal
      </footer>
    </div>
  );
};

export default Layout;
