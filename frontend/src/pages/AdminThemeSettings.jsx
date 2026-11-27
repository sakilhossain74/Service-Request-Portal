import { useState } from 'react';
import { toast } from 'react-toastify';
import { Palette, RotateCcw, Save, AlertTriangle } from 'lucide-react';
import {
  DEFAULT_THEME,
  THEME_FIELDS,
  applyTheme,
  getContrastRatio,
  getSavedTheme,
  resetTheme,
  saveTheme
} from '../utils/theme';
import useReveal from '../hooks/useReveal';

const HEX_PATTERN = /^#[0-9a-fA-F]{6}$/;

const AdminThemeSettings = () => {
  const [theme, setTheme] = useState(() => getSavedTheme());
  const cardRef   = useReveal({ direction: 'up', delay: 80 });

  const handleColorChange = (key, value) => {
    const next = { ...theme, [key]: value };
    setTheme(next);
    if (HEX_PATTERN.test(value)) {
      applyTheme(next);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    for (const field of THEME_FIELDS) {
      if (!HEX_PATTERN.test(theme[field.key])) {
        toast.error(`Please enter a valid 6-digit hex color for ${field.label}`);
        return;
      }
    }
    saveTheme(theme);
    toast.success('Theme settings saved and applied');
  };

  const handleReset = () => {
    const defaults = resetTheme();
    setTheme(defaults);
    toast.info('Theme reset to default palette');
  };

  const cardContrast = getContrastRatio(theme.text, theme.cardBg);
  const pageContrast = getContrastRatio(theme.text, theme.background);
  const lowContrast = cardContrast < 4.5 || pageContrast < 4.5;

  return (
    <div className="page-fade-in">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4 page-header-row">
        <div>
          <h2 className="page-title d-flex align-items-center gap-2">
            <Palette size={24} />
            <span>Theme Settings</span>
          </h2>
          <p className="page-subtitle mb-0">
            Customize portal colors with live preview. Saved preferences persist across sessions.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={handleReset}
        >
          <RotateCcw size={16} />
          <span>Reset to Default</span>
        </button>
      </div>

      {lowContrast && (
        <div className="alert-warning-custom d-flex align-items-center gap-2 mb-4" role="alert">
          <AlertTriangle size={18} />
          <span>
            Low contrast detected between Body Text and Card/Page Background (ratio{' '}
            {Math.min(cardContrast, pageContrast).toFixed(2)}:1; WCAG AA recommends at least 4.5:1).
          </span>
        </div>
      )}

      <form onSubmit={handleSave}>
        <div ref={cardRef} className="card portal-card mb-4">
          <div className="card-header">Color Palette</div>
          <div className="card-body">
            <div className="row g-4">
              {THEME_FIELDS.map((field) => (
                <div className="col-sm-6 col-lg-3" key={field.key}>
                  <label htmlFor={`theme-${field.key}`} className="form-label">
                    {field.label}
                  </label>
                  <div className="d-flex align-items-center gap-2">
                    <input
                      id={`theme-${field.key}`}
                      type="color"
                      className="form-control form-control-color srp-color-picker"
                      value={HEX_PATTERN.test(theme[field.key]) ? theme[field.key] : DEFAULT_THEME[field.key]}
                      onChange={(e) => handleColorChange(field.key, e.target.value)}
                      aria-label={`${field.label} picker`}
                    />
                    <input
                      type="text"
                      className="form-control font-monospace"
                      value={theme[field.key]}
                      maxLength={7}
                      onChange={(e) => handleColorChange(field.key, e.target.value)}
                      aria-label={`${field.label} hex code`}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="d-flex flex-wrap gap-2 mt-4 pt-3 border-top">
              <button type="submit" className="btn btn-primary">
                <Save size={16} />
                <span>Save Theme</span>
              </button>
              <button type="button" className="btn btn-outline-secondary" onClick={handleReset}>
                <RotateCcw size={16} />
                <span>Reset to Default</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminThemeSettings;
