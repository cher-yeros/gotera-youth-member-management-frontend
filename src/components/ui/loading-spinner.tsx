import React from "react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "brand" | "minimal";
  className?: string;
  text?: string;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-12 w-12",
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  variant = "brand",
  className,
  text,
}) => {
  const getSpinnerClasses = () => {
    switch (variant) {
      case "brand":
        return "border-primary border-t-transparent";
      case "minimal":
        return "border-muted-foreground border-t-transparent";
      default:
        return "border-primary border-t-transparent";
    }
  };

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-2",
          sizeClasses[size],
          getSpinnerClasses()
        )}
      />
      {text && (
        <p className="mt-2 text-sm text-muted-foreground animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
