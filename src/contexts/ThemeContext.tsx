import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type Theme = 'default' | 'ocean' | 'sunset' | 'light' | 'forest' | 'sepia';

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
  {
    value: 'light' as Theme,
    label: 'Clean Light',
    description: 'Clean modern light theme for daytime use',
    colors: {
      primary: 'hsl(247 92% 58%)',
      secondary: 'hsl(262 83% 48%)',
    },
  },
  {
    value: 'forest' as Theme,
    label: 'Forest Green',
    description: 'Soothing forest theme with calming green tones',
    colors: {
      primary: 'hsl(142 76% 36%)',
      secondary: 'hsl(158 64% 52%)',
    },
  },
  {
    value: 'sepia' as Theme,
    label: 'Warm Sepia',
    description: 'Reading-friendly warm sepia theme for comfortable viewing',
    colors: {
      primary: 'hsl(30 50% 45%)',
      secondary: 'hsl(45 65% 55%)',
    },
  },
];

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('default');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadThemeFromDatabase();
  }, []);

  const loadThemeFromDatabase = async () => {
    try {
      // Get real user session from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      if (userId) {
        // Fetch theme from Supabase database
        const { data, error } = await supabase
          .from('user_preferences')
          .select('theme')
          .eq('user_id', userId)
          .maybeSingle();

        if (error) {
          console.error('Error loading theme from database:', error);
          // Fall back to localStorage
          const savedTheme = localStorage.getItem('portfolio-theme') as Theme;
          if (savedTheme && themes.some(t => t.value === savedTheme)) {
            setThemeState(savedTheme);
          }
        } else if (data?.theme) {
          setThemeState(data.theme as Theme);
          console.log(`✅ Theme loaded from database: ${data.theme}`);
        } else {
          // No theme found in database, use localStorage or default
          const savedTheme = localStorage.getItem('portfolio-theme') as Theme;
          if (savedTheme && themes.some(t => t.value === savedTheme)) {
            setThemeState(savedTheme);
          }
        }
      } else {
        // No user, use localStorage
        const savedTheme = localStorage.getItem('portfolio-theme') as Theme;
        if (savedTheme && themes.some(t => t.value === savedTheme)) {
          setThemeState(savedTheme);
        }
      }
    } catch (error) {
      console.error('Error in loadThemeFromDatabase:', error);
      // Fall back to localStorage
      const savedTheme = localStorage.getItem('portfolio-theme') as Theme;
      if (savedTheme && themes.some(t => t.value === savedTheme)) {
        setThemeState(savedTheme);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Apply theme immediately with minimal processing
    document.documentElement.setAttribute('data-theme', theme);

    // Save theme to localStorage
    localStorage.setItem('portfolio-theme', theme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    console.log(`🎨 Setting theme to: ${newTheme}`);

    // Update state immediately for instant UI response
    setThemeState(newTheme);

    // Handle database save asynchronously without blocking UI
    const saveToDatabase = async () => {
      try {
        // Get real user session from Supabase
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;

        if (userId) {
          // Save theme to Supabase database - non-blocking
          const { error } = await supabase
            .from('user_preferences')
            .upsert({
              user_id: userId,
              theme: newTheme
            });

          if (error) {
            console.error('Error saving theme to database:', error);
          } else {
            console.log(`✅ Theme saved to database: ${newTheme}`);
          }
        }
      } catch (error) {
        console.error('Error in saveToDatabase:', error);
      }
    };

    // Execute database save without awaiting to prevent blocking
    saveToDatabase();
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {!isLoading && children}
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