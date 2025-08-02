import React from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Palette, Check } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const ThemeSwitcher: React.FC = () => {
  const { theme: currentTheme, setTheme, themes } = useTheme();

  const handleThemeChange = (themeValue: string) => {
    // Add immediate visual feedback
    const button = document.querySelector('[data-theme-switcher]');
    if (button) {
      button.classList.add('no-theme-transition');
      setTimeout(() => {
        button.classList.remove('no-theme-transition');
      }, 100);
    }

    setTheme(themeValue as any);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2"
          data-theme-switcher
        >
          <Palette className="h-4 w-4" />
          <span className="hidden sm:inline">Theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 bg-popover/95 backdrop-blur-sm border-border z-50"
      >
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme.value}
            onClick={() => handleThemeChange(theme.value)}
            className="flex items-center justify-between p-3 cursor-pointer hover:bg-accent/50 transition-colors duration-150"
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-4 h-4 rounded-full border border-border"
                style={{
                  background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`
                }}
              />
              <div>
                <div className="font-medium">{theme.label}</div>
                <div className="text-xs text-muted-foreground">{theme.description}</div>
              </div>
            </div>
            {currentTheme === theme.value && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSwitcher;