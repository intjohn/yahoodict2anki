import type { ThemeName } from './colors';

// Theme management utility
export class ThemeManager {
  private static instance: ThemeManager;
  private currentTheme: ThemeName = 'blue';

  private constructor() {
    // Initialize with default theme
    this.setTheme('blue');
  }

  static getInstance(): ThemeManager {
    if (!ThemeManager.instance) {
      ThemeManager.instance = new ThemeManager();
    }
    return ThemeManager.instance;
  }

  setTheme(theme: ThemeName): void {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);

    // Store in localStorage for persistence
    localStorage.setItem('theme', theme);
  }

  getTheme(): ThemeName {
    return this.currentTheme;
  }

  // Initialize theme from localStorage or default
  initialize(): void {
    const savedTheme = localStorage.getItem('theme') as ThemeName;
    if (savedTheme && ['blue', 'green', 'purple'].includes(savedTheme)) {
      this.setTheme(savedTheme);
    } else {
      this.setTheme('blue');
    }
  }

  // Cycle through themes
  cycleTheme(): ThemeName {
    const themes: ThemeName[] = ['blue', 'green', 'purple'];
    const currentIndex = themes.indexOf(this.currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    const nextTheme = themes[nextIndex];
    this.setTheme(nextTheme);
    return nextTheme;
  }
}

// Export singleton instance
export const themeManager = ThemeManager.getInstance();

// Initialize theme on module load
if (typeof document !== 'undefined') {
  themeManager.initialize();
}
