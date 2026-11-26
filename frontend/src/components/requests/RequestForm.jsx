import { useState } from 'react';
import { CATEGORIES, PRIORITIES } from '../../utils/constants';

const RequestForm = ({
  initialValues = {
    title: '',
    description: '',
    category: CATEGORIES[0],
    priority: 'Medium'
  },
  onSubmit,
  submitting = false,
  submitLabel = 'Submit Request'
}) => {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const nextErrors = {};
    const trimmedTitle = formData.title.trim();
    const trimmedDescription = formData.description.trim();

    if (!trimmedTitle) {
      nextErrors.title = 'Title is required';
    } else if (trimmedTitle.length < 3 || trimmedTitle.length > 100) {
      nextErrors.title = 'Title must be between 3 and 100 characters';
    }

    if (!trimmedDescription) {
      nextErrors.description = 'Description is required';
    } else if (trimmedDescription.length < 10 || trimmedDescription.length > 1000) {
      nextErrors.description = 'Description must be between 10 and 1000 characters';
    }

    if (!CATEGORIES.includes(formData.category)) {
      nextErrors.category = 'Please select a valid category';
    }

    if (!PRIORITIES.includes(formData.priority)) {
      nextErrors.priority = 'Please select a valid priority';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      priority: formData.priority
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="mb-3">
        <label htmlFor="title" className="form-label fw-semibold">
          Title <span className="text-danger">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          className={`form-control ${errors.title ? 'is-invalid' : ''}`}
          placeholder="Brief summary of the issue (3-100 characters)"
          value={formData.title}
          onChange={handleChange}
          disabled={submitting}
        />
        {errors.title && <div className="invalid-feedback">{errors.title}</div>}
      </div>

      <div className="row g-3 mb-3">
        <div className="col-md-6">
          <label htmlFor="category" className="form-label fw-semibold">
            Category <span className="text-danger">*</span>
          </label>
          <select
            id="category"
            name="category"
            className={`form-select ${errors.category ? 'is-invalid' : ''}`}
            value={formData.category}
            onChange={handleChange}
            disabled={submitting}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && <div className="invalid-feedback">{errors.category}</div>}
        </div>

        <div className="col-md-6">
          <label htmlFor="priority" className="form-label fw-semibold">
            Priority <span className="text-danger">*</span>
          </label>
          <select
            id="priority"
            name="priority"
            className={`form-select ${errors.priority ? 'is-invalid' : ''}`}
            value={formData.priority}
            onChange={handleChange}
            disabled={submitting}
          >
            {PRIORITIES.map((prio) => (
              <option key={prio} value={prio}>
                {prio}
              </option>
            ))}
          </select>
          {errors.priority && <div className="invalid-feedback">{errors.priority}</div>}
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="form-label fw-semibold">
          Description <span className="text-danger">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows="4"
          className={`form-control ${errors.description ? 'is-invalid' : ''}`}
          placeholder="Describe the problem, location, and any helpful details (10-1000 characters)"
          value={formData.description}
          onChange={handleChange}
          disabled={submitting}
        />
        {errors.description && <div className="invalid-feedback">{errors.description}</div>}
      </div>

      <button type="submit" className="btn btn-primary px-4" disabled={submitting}>
        {submitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
};

export default RequestForm;
