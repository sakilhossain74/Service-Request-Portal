import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ROLES } from './utils/constants';
import ProtectedRoute from './components/routing/ProtectedRoute';
import RoleRoute from './components/routing/RoleRoute';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import RequestList from './pages/RequestList';
import CreateRequest from './pages/CreateRequest';
import EditRequest from './pages/EditRequest';
import RequestDetails from './pages/RequestDetails';
import AdminAssignment from './pages/AdminAssignment';
import NotFound from './pages/NotFound';

const RoleDashboard = () => {
  const { isAdmin } = useAuth();
  return isAdmin ? <AdminDashboard /> : <UserDashboard />;
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<RoleDashboard />} />
              <Route path="/requests" element={<RequestList />} />
              <Route path="/requests/new" element={<CreateRequest />} />
              <Route path="/requests/:id" element={<RequestDetails />} />
              <Route path="/requests/:id/edit" element={<EditRequest />} />

              <Route element={<RoleRoute allowedRoles={[ROLES.ADMIN]} />}>
                <Route path="/admin/assignments" element={<AdminAssignment />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </AuthProvider>
  );
};

export default App;
