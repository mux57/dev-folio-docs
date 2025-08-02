import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface MobileResponsiveProps {
  children: ReactNode;
  className?: string;
}

// Mobile-first responsive container
export const MobileContainer = ({ children, className }: MobileResponsiveProps) => {
  return (
    <div className={cn(
      "w-full px-4 sm:px-6 lg:px-8 mx-auto",
      "max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl",
      className
    )}>
      {children}
    </div>
  );
};

// Mobile-optimized grid
export const MobileGrid = ({ children, className }: MobileResponsiveProps) => {
  return (
    <div className={cn(
      "grid grid-cols-1 gap-4",
      "sm:grid-cols-2 sm:gap-6",
      "lg:grid-cols-3 lg:gap-8",
      className
    )}>
      {children}
    </div>
  );
};

// Mobile-friendly button
interface MobileButtonProps {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export const MobileButton = ({ 
  children, 
  className, 
  variant = "primary",
  size = "md",
  onClick,
  disabled,
  type = "button"
}: MobileButtonProps) => {
  const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const sizeClasses = {
    sm: "min-h-[40px] px-3 py-2 text-sm",
    md: "min-h-[44px] px-4 py-2 text-base",
    lg: "min-h-[48px] px-6 py-3 text-lg"
  };
  
  const variantClasses = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-secondary",
    outline: "border border-border bg-background hover:bg-muted focus:ring-primary"
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      {children}
    </button>
  );
};

// Mobile-optimized text
interface MobileTextProps {
  children: ReactNode;
  variant?: "h1" | "h2" | "h3" | "h4" | "body" | "caption";
  className?: string;
}

export const MobileText = ({ children, variant = "body", className }: MobileTextProps) => {
  const variantClasses = {
    h1: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight",
    h2: "text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight",
    h3: "text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold leading-tight",
    h4: "text-base sm:text-lg md:text-xl lg:text-2xl font-medium leading-tight",
    body: "text-sm sm:text-base md:text-lg leading-relaxed",
    caption: "text-xs sm:text-sm text-muted-foreground"
  };
  
  return (
    <div className={cn(variantClasses[variant], className)}>
      {children}
    </div>
  );
};

// Mobile-optimized spacing
export const MobileSpacing = ({ children, size = "md" }: { children: ReactNode; size?: "sm" | "md" | "lg" | "xl" }) => {
  const spacingClasses = {
    sm: "space-y-2 sm:space-y-3",
    md: "space-y-4 sm:space-y-6",
    lg: "space-y-6 sm:space-y-8 lg:space-y-10",
    xl: "space-y-8 sm:space-y-12 lg:space-y-16"
  };
  
  return (
    <div className={spacingClasses[size]}>
      {children}
    </div>
  );
};

// Mobile touch target helper
export const TouchTarget = ({ children, className }: MobileResponsiveProps) => {
  return (
    <div className={cn("min-h-[44px] min-w-[44px] flex items-center justify-center", className)}>
      {children}
    </div>
  );
};
