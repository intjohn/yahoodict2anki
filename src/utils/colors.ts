// Simple color system with predefined harmonious palettes
export const colors = {
  // Blue palette
  blue: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },

  // Green palette
  green: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },

  // Purple palette
  purple: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7c3aed',
    800: '#6b21a8',
    900: '#581c87',
  },

  // Gray palette
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },

  // Semantic colors
  semantic: {
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
} as const;

type ColorShade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
type ColorPalette = keyof Omit<typeof colors, 'semantic'>;

// Helper function to get a color from any palette
export function getColor(palette: ColorPalette, shade: ColorShade): string {
  return colors[palette][shade];
}

// Predefined themes
export const themes = {
  blue: {
    primary: colors.blue[600],
    secondary: colors.blue[200],
    accent: colors.blue[400],
    background: colors.blue[50],
    text: colors.gray[900],
  },
  green: {
    primary: colors.green[600],
    secondary: colors.green[200],
    accent: colors.green[400],
    background: colors.green[50],
    text: colors.gray[900],
  },
  purple: {
    primary: colors.purple[600],
    secondary: colors.purple[200],
    accent: colors.purple[400],
    background: colors.purple[50],
    text: colors.gray[900],
  },
} as const;

export type ThemeName = keyof typeof themes;
