import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { extractErrorMessage } from '../utils/formatters';

const Login = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const validate = () => {
    const nextErrors = {};
    if (!formData.email.trim()) {
      nextErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      nextErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      nextErrors.password = 'Password is required';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const user = await login({
        email: formData.email.trim(),
        password: formData.password
      });
      toast.success(`Welcome back, ${user.name}!`);
      navigate('/dashboard');
    } catch (error) {
      toast.error(extractErrorMessage(error, 'Login failed'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="card portal-card auth-card">
        <div className="card-body p-4 p-md-5">
          <h3 className="fw-bold text-center mb-1">Service Request Portal</h3>
          <p className="text-muted text-center small mb-4">
            Sign in to submit and track service requests
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="login-email" className="form-label fw-semibold">
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, email: e.target.value }));
                  if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                }}
                disabled={submitting}
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="login-password" className="form-label fw-semibold">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, password: e.target.value }));
                  if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                }}
                disabled={submitting}
              />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 py-2 fw-semibold"
              disabled={submitting}
            >
              {submitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="alert alert-light border mt-4 mb-3 small">
            <div className="fw-semibold mb-1">Demo Credentials (Seeded)</div>
            <div>Admin: <code>admin@example.com</code> / <code>Admin@123</code></div>
            <div>User: <code>user@example.com</code> / <code>User@123</code></div>
          </div>

          <p className="text-center small text-muted mb-0">
            Don&apos;t have an account? <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
