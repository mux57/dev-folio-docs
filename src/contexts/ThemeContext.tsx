import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

// ✅ All 6 themes now supported by database constraint
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

// ✅ All 6 themes now supported by updated database constraint
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
      // 🔄 Step 1: Always load from localStorage first (instant, reliable)
      const savedTheme = localStorage.getItem('portfolio-theme') as Theme;
      if (savedTheme && themes.some(t => t.value === savedTheme)) {
        setThemeState(savedTheme);
        console.log(`✅ Theme loaded from localStorage: ${savedTheme}`);
      } else {
        console.log('No valid theme in localStorage, using default');
      }

      // 🔄 Step 2: Try to load from database for authenticated users (sync across devices)
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      if (userId) {
        console.log('🔍 Checking database for theme preferences...');

        // Try 'theme' column directly (this should work based on your schema)
        const { data: themeData, error: themeError } = await supabase
          .from('user_preferences')
          .select('theme')
          .eq('user_id', userId)
          .maybeSingle();

        if (themeError) {
          console.warn('Database theme fetch error:', themeError);
        } else if (themeData?.theme) {
          const dbTheme = themeData.theme;
          console.log(`📥 Database theme found: ${dbTheme}`);

          // Validate and use database theme if different from localStorage
          if (themes.some(t => t.value === dbTheme) && dbTheme !== savedTheme) {
            setThemeState(dbTheme as Theme);
            // Update localStorage to match database
            localStorage.setItem('portfolio-theme', dbTheme);
            console.log(`✅ Theme synced from database: ${dbTheme}`);
          }
        } else {
          console.log('No theme found in database');
        }
      } else {
        console.log('No authenticated user, using localStorage only');
      }
    } catch (error) {
      console.error('Error in loadThemeFromDatabase:', error);
      // Ensure we always have a theme set
      const savedTheme = localStorage.getItem('portfolio-theme') as Theme;
      if (savedTheme && themes.some(t => t.value === savedTheme)) {
        setThemeState(savedTheme);
      } else {
        setThemeState('default');
        localStorage.setItem('portfolio-theme', 'default');
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
        // Validate theme value before saving to database
        const validThemeValues = themes.map(t => t.value);
        if (!validThemeValues.includes(newTheme)) {
          console.warn(`Invalid theme value: ${newTheme}. Valid values are:`, validThemeValues);
          return;
        }

        // Get real user session from Supabase
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;

        if (userId) {
          let saveSuccess = false;

          // Approach 1: Try saving to 'theme' column directly with validated value
          try {
            const { error: themeError } = await supabase
              .from('user_preferences')
              .upsert({
                user_id: userId,
                theme: newTheme // This is now validated to be one of: default, ocean, sunset, light, forest, sepia
              }, {
                onConflict: 'user_id'
              });

            if (!themeError) {
              saveSuccess = true;
              console.log(`✅ Theme saved to database (theme column): ${newTheme}`);
            } else {
              console.warn('Theme column save failed:', themeError);
            }
          } catch (e) {
            console.warn('Theme column approach failed:', e);
          }

          // Approach 2: Try saving to 'preferences' JSONB column
          if (!saveSuccess) {
            try {
              // First get existing preferences
              const { data: existingData } = await supabase
                .from('user_preferences')
                .select('preferences')
                .eq('user_id', userId)
                .maybeSingle();

              const updatedPreferences = {
                ...((existingData as any)?.preferences || {}),
                theme: newTheme // Validated theme value
              };

              const { error: prefError } = await supabase
                .from('user_preferences')
                .upsert({
                  user_id: userId,
                  preferences: updatedPreferences
                }, {
                  onConflict: 'user_id'
                });

              if (!prefError) {
                saveSuccess = true;
                console.log(`✅ Theme saved to database (preferences column): ${newTheme}`);
              } else {
                console.warn('Preferences column save failed:', prefError);
              }
            } catch (e) {
              console.warn('Preferences column approach failed:', e);
            }
          }

          if (!saveSuccess) {
            console.log(`ℹ️ Database save failed, theme saved to localStorage: ${newTheme}`);
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