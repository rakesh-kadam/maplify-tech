import { create } from 'zustand';
import { getSettings, saveSettings } from '../utils/storage';

interface ThemeState {
  theme: 'light' | 'dark' | 'auto';
  effectiveTheme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
}

// Check system preference
function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// Calculate effective theme
function getEffectiveTheme(theme: 'light' | 'dark' | 'auto'): 'light' | 'dark' {
  if (theme === 'auto') {
    return getSystemTheme();
  }
  return theme;
}

export const useThemeStore = create<ThemeState>((set, get) => {
  const settings = getSettings();
  const initialTheme = settings.theme;
  const initialEffectiveTheme = getEffectiveTheme(initialTheme);

  // Apply initial theme to document
  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', initialEffectiveTheme === 'dark');
  }

  // Listen to system theme changes
  if (typeof window !== 'undefined') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const { theme } = get();
      if (theme === 'auto') {
        const newEffectiveTheme = getSystemTheme();
        set({ effectiveTheme: newEffectiveTheme });
        document.documentElement.classList.toggle('dark', newEffectiveTheme === 'dark');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
  }

  return {
    theme: initialTheme,
    effectiveTheme: initialEffectiveTheme,

    setTheme: (theme) => {
      const effectiveTheme = getEffectiveTheme(theme);
      set({ theme, effectiveTheme });

      // Save to localStorage
      const settings = getSettings();
      saveSettings({ ...settings, theme });

      // Apply to document
      document.documentElement.classList.toggle('dark', effectiveTheme === 'dark');
    },
  };
});
