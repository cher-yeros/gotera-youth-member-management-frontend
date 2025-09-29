import React from "react";
import { cn } from "@/lib/utils";

// Brand Logo Component
interface BrandLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showText?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = "md",
  className,
  showText = true,
}) => {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
    xl: "text-4xl",
  };

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div
        className={cn(
          "bg-brand-gradient rounded-lg flex items-center justify-center text-white font-bold",
          sizeClasses[size]
        )}
      >
        GY
      </div>
      {showText && (
        <span
          className={cn("font-bold text-brand-gradient", textSizeClasses[size])}
        >
          Gotera Youth
        </span>
      )}
    </div>
  );
};

// Brand Button Component
interface BrandButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const BrandButton: React.FC<BrandButtonProps> = ({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}) => {
  const baseClasses =
    "font-medium transition-all duration-200 focus-brand-ring";

  const variantClasses = {
    primary: "bg-brand-gradient hover:opacity-90 text-white shadow-brand",
    secondary: "bg-secondary hover:bg-secondary/90 text-secondary-foreground",
    outline:
      "border-primary text-primary hover:bg-primary hover:text-primary-foreground",
    ghost: "text-primary hover:bg-primary/10",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

// Brand Card Component
interface BrandCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "gradient" | "outlined";
  hover?: boolean;
}

export const BrandCard: React.FC<BrandCardProps> = ({
  variant = "default",
  hover = true,
  className,
  children,
  ...props
}) => {
  const baseClasses = "rounded-xl border transition-all duration-300";

  const variantClasses = {
    default: "bg-card shadow-brand",
    gradient: "bg-brand-gradient text-white shadow-brand-lg",
    outlined: "border-primary bg-transparent",
  };

  const hoverClasses = hover ? "hover-brand-glow" : "";

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        hoverClasses,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// Brand Badge Component
interface BrandBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "success" | "warning" | "error";
  size?: "sm" | "md" | "lg";
}

export const BrandBadge: React.FC<BrandBadgeProps> = ({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-full font-medium";

  const variantClasses = {
    primary: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    success: "bg-green-500 text-white",
    warning: "bg-yellow-500 text-white",
    error: "bg-red-500 text-white",
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  };

  return (
    <span
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

// Brand Input Component
interface BrandInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "outlined" | "filled";
}

export const BrandInput: React.FC<BrandInputProps> = ({
  variant = "default",
  className,
  ...props
}) => {
  const baseClasses =
    "w-full px-3 py-2 rounded-md transition-all duration-200 focus-brand-ring";

  const variantClasses = {
    default: "border border-input bg-background",
    outlined: "border-2 border-primary bg-transparent",
    filled: "border-0 bg-muted",
  };

  return (
    <input
      className={cn(baseClasses, variantClasses[variant], className)}
      {...props}
    />
  );
};
