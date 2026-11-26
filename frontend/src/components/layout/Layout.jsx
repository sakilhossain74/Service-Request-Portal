import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="min-vh-100 d-flex flex-column">
      <Navbar />
      <main className="container portal-main flex-grow-1 page-fade-in">
        <Outlet />
      </main>
      <footer className="portal-footer">
        Service Request &amp; Resolution Portal
      </footer>
    </div>
  );
};

export default Layout;
