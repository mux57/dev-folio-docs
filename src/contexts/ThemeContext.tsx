import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'default' | 'ocean' | 'sunset';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themes: Array<{
    value: Theme;
    label: string;
    description: string;
    colors: {
      primary: string;
      secondary: string;
    };
  }>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const themes = [
  {
    value: 'default' as Theme,
    label: 'Cosmic Purple',
    description: 'Professional dark theme with purple accents',
    colors: {
      primary: 'hsl(247 92% 68%)',
      secondary: 'hsl(262 83% 58%)',
    },
  },
  {
    value: 'ocean' as Theme,
    label: 'Ocean Blue',
    description: 'Calming ocean-inspired blue theme',
    colors: {
      primary: 'hsl(200 85% 60%)',
      secondary: 'hsl(180 65% 55%)',
    },
  },
  {
    value: 'sunset' as Theme,
    label: 'Sunset Orange',
    description: 'Warm sunset theme with orange and pink',
    colors: {
      primary: 'hsl(25 90% 65%)',
      secondary: 'hsl(340 75% 60%)',
    },
  },
];

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('default');

  useEffect(() => {
    // Load theme from localStorage on mount
    const savedTheme = localStorage.getItem('portfolio-theme') as Theme;
    if (savedTheme && themes.some(t => t.value === savedTheme)) {
      setThemeState(savedTheme);
    }
  }, []);

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
    // Save theme to localStorage
    localStorage.setItem('portfolio-theme', theme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};