import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { extractErrorMessage } from '../utils/formatters';
import useReveal from '../hooks/useReveal';

const Register = () => {
  const { isAuthenticated, register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const cardRef = useReveal({ direction: 'up', delay: 0 });

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const validate = () => {
    const nextErrors = {};
    const name = formData.name.trim();
    const email = formData.email.trim();

    if (!name) {
      nextErrors.name = 'Name is required';
    } else if (name.length < 2 || name.length > 50) {
      nextErrors.name = 'Name must be between 2 and 50 characters';
    }

    if (!email) {
      nextErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      nextErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      nextErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password
      });
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(extractErrorMessage(error, 'Registration failed'));
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
              Create Your Account
            </h2>
            <p className="mb-0" style={{ color: 'var(--color-chrome-muted)', fontSize: '0.875rem' }}>
              Register to submit maintenance or IT requests and monitor resolution progress.
            </p>
          </div>
          <div className="d-none d-md-flex flex-column gap-2 mt-4" style={{ fontSize: '0.825rem' }}>
            <div className="d-flex align-items-center gap-2">
              <CheckCircle2 size={15} style={{ color: 'var(--color-accent)' }} />
              <span>Instant request submission &amp; tracking</span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <CheckCircle2 size={15} style={{ color: 'var(--color-accent)' }} />
              <span>Clear status updates &amp; deadline visibility</span>
            </div>
          </div>
        </div>

        <div className="auth-form-panel">
          <div className="mb-4">
            <h1 className="auth-title mb-1">Register</h1>
            <p className="auth-subtitle mb-0">Fill in your details to get started</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="reg-name" className="form-label">Full Name</label>
              <input
                id="reg-name"
                type="text"
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                placeholder="Jane Doe"
                value={formData.name}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, name: e.target.value }));
                  if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                }}
                disabled={submitting}
              />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="reg-email" className="form-label">Email Address</label>
              <input
                id="reg-email"
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                placeholder="jane@example.com"
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
              <label htmlFor="reg-password" className="form-label">Password</label>
              <input
                id="reg-password"
                type="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                placeholder="Minimum 6 characters"
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
              {submitting ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-center mt-4 mb-0" style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
