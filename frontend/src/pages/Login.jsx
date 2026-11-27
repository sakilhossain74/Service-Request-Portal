import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { extractErrorMessage } from '../utils/formatters';
import useReveal from '../hooks/useReveal';

const Login = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const cardRef = useReveal({ direction: 'up', delay: 0 });

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
      <div ref={cardRef} className="auth-split-card">
        <div className="auth-brand-panel">
          <div>
            <span className="auth-brand-pill mb-3">
              <ShieldCheck size={15} />
              <span>Service Request Portal</span>
            </span>
            <h2 className="fw-bold mb-2" style={{ color: 'var(--color-chrome-text)' }}>
              Streamlined IT &amp; Facility Operations
            </h2>
            <p className="mb-0" style={{ color: 'var(--color-chrome-muted)', fontSize: '0.875rem' }}>
              Submit, assign, track, and resolve service requests with real-time deadline visibility.
            </p>
          </div>
          <div className="d-none d-md-flex flex-column gap-2 mt-4" style={{ fontSize: '0.825rem' }}>
            <div className="d-flex align-items-center gap-2">
              <CheckCircle2 size={15} style={{ color: 'var(--color-accent)' }} />
              <span>Role-scoped dashboards &amp; permissions</span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <CheckCircle2 size={15} style={{ color: 'var(--color-accent)' }} />
              <span>Staff assignment &amp; SLA deadline tracking</span>
            </div>
          </div>
        </div>

        <div className="auth-form-panel">
          <div className="mb-4">
            <h1 className="auth-title mb-1">Sign In</h1>
            <p className="auth-subtitle mb-0">Enter your credentials to access your workspace</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="login-email" className="form-label">
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

            <div className="mb-4">
              <label htmlFor="login-password" className="form-label">
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
              className="btn btn-primary w-100 py-2"
              disabled={submitting}
            >
              {submitting ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="text-center mt-4 mb-0" style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            Don&apos;t have an account? <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
