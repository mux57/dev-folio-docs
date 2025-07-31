import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type Theme = 'default' | 'ocean' | 'sunset' | 'light';

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
];

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('default');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadThemeFromSupabase();
  }, []);

  const loadThemeFromSupabase = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // User is logged in, fetch theme from Supabase
        const { data, error } = await supabase
          .from('user_preferences')
          .select('theme')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (error) {
          console.error('Error loading theme from Supabase:', error);
          // Fall back to localStorage
          const savedTheme = localStorage.getItem('portfolio-theme') as Theme;
          if (savedTheme && themes.some(t => t.value === savedTheme)) {
            setThemeState(savedTheme);
          }
        } else if (data?.theme) {
          setThemeState(data.theme as Theme);
        }
      } else {
        // User not logged in, use localStorage
        const savedTheme = localStorage.getItem('portfolio-theme') as Theme;
        if (savedTheme && themes.some(t => t.value === savedTheme)) {
          setThemeState(savedTheme);
        }
      }
    } catch (error) {
      console.error('Error in loadThemeFromSupabase:', error);
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
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
    // Save theme to localStorage as backup
    localStorage.setItem('portfolio-theme', theme);
  }, [theme]);

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // User is logged in, save to Supabase
        const { error } = await supabase
          .from('user_preferences')
          .upsert({ 
            user_id: session.user.id, 
            theme: newTheme 
          });

        if (error) {
          console.error('Error saving theme to Supabase:', error);
        }
      }
      // Always save to localStorage as backup
      localStorage.setItem('portfolio-theme', newTheme);
    } catch (error) {
      console.error('Error in setTheme:', error);
      // Still save to localStorage
      localStorage.setItem('portfolio-theme', newTheme);
    }
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