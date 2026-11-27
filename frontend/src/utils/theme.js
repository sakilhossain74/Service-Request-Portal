export const THEME_STORAGE_KEY = 'srp_theme_settings_v1';

export const DEFAULT_THEME = {
  primary: '#62d84e',
  secondary: '#0b2a3c',
  accent: '#62d84e',
  sidebarBg: '#032d42',
  navbarBg: '#032d42',
  background: '#f5f7f8',
  cardBg: '#ffffff',
  text: '#1b2a33'
};

export const THEME_FIELDS = [
  { key: 'primary', label: 'Primary Color', cssVar: '--color-primary' },
  { key: 'secondary', label: 'Secondary Color', cssVar: '--color-secondary' },
  { key: 'accent', label: 'Accent Color', cssVar: '--color-accent' },
  { key: 'sidebarBg', label: 'Sidebar Background', cssVar: '--color-sidebar-bg' },
  { key: 'navbarBg', label: 'Navbar Background', cssVar: '--color-navbar-bg' },
  { key: 'background', label: 'Page Background', cssVar: '--color-background' },
  { key: 'cardBg', label: 'Card Surface', cssVar: '--color-card-bg' },
  { key: 'text', label: 'Body Text', cssVar: '--color-text' }
];

const parseHex = (hex) => {
  if (typeof hex !== 'string') return null;
  const clean = hex.trim().replace('#', '');
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return null;
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16)
  };
};

const toRelativeLuminance = ({ r, g, b }) => {
  const channel = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
};

export const getContrastRatio = (hexA, hexB) => {
  const rgbA = parseHex(hexA);
  const rgbB = parseHex(hexB);
  if (!rgbA || !rgbB) return 21;
  const lumA = toRelativeLuminance(rgbA);
  const lumB = toRelativeLuminance(rgbB);
  const lighter = Math.max(lumA, lumB);
  const darker = Math.min(lumA, lumB);
  return (lighter + 0.05) / (darker + 0.05);
};

const darkenHex = (hex, amount = 0.14) => {
  const rgb = parseHex(hex);
  if (!rgb) return hex;
  const clamp = (v) => Math.max(0, Math.min(255, Math.round(v * (1 - amount))));
  const toHex = (v) => v.toString(16).padStart(2, '0');
  return `#${toHex(clamp(rgb.r))}${toHex(clamp(rgb.g))}${toHex(clamp(rgb.b))}`;
};

export const getSavedTheme = () => {
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_THEME };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_THEME, ...parsed };
  } catch {
    return { ...DEFAULT_THEME };
  }
};

export const applyTheme = (themeObj = DEFAULT_THEME) => {
  const merged = { ...DEFAULT_THEME, ...themeObj };
  const root = document.documentElement;

  for (const field of THEME_FIELDS) {
    if (merged[field.key]) {
      root.style.setProperty(field.cssVar, merged[field.key]);
    }
  }

  // Derive accessible hover, text-on-primary, soft tint, and focus ring
  root.style.setProperty('--color-primary-hover', darkenHex(merged.primary, 0.14));
  const darkTextRatio = getContrastRatio('#032d42', merged.primary);
  const lightTextRatio = getContrastRatio('#ffffff', merged.primary);
  root.style.setProperty(
    '--color-primary-text',
    darkTextRatio >= lightTextRatio ? '#032d42' : '#ffffff'
  );

  const primaryRgb = parseHex(merged.primary);
  if (primaryRgb) {
    root.style.setProperty(
      '--color-primary-soft',
      `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.14)`
    );
    root.style.setProperty(
      '--color-primary-ring',
      `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.35)`
    );
  }
};

export const saveTheme = (themeObj) => {
  const merged = { ...DEFAULT_THEME, ...themeObj };
  localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(merged));
  applyTheme(merged);
  return merged;
};

export const resetTheme = () => {
  localStorage.removeItem(THEME_STORAGE_KEY);
  applyTheme(DEFAULT_THEME);
  return { ...DEFAULT_THEME };
};
