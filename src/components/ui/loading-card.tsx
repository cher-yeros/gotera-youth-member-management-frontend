import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import LoadingSpinner from "./loading-spinner";
import { cn } from "@/lib/utils";

interface LoadingCardProps {
  title?: string;
  subtitle?: string;
  showSkeleton?: boolean;
  skeletonLines?: number;
  className?: string;
  variant?: "default" | "minimal" | "detailed";
}

const LoadingCard: React.FC<LoadingCardProps> = ({
  title,
  subtitle,
  showSkeleton = true,
  skeletonLines = 3,
  className,
  variant = "default",
}) => {
  const renderSkeleton = () => {
    if (!showSkeleton) return null;

    return (
      <div className="space-y-3">
        {Array.from({ length: skeletonLines }).map((_, index) => (
          <div key={index} className="space-y-2">
            <div
              className={cn(
                "bg-muted rounded animate-pulse",
                index === 0 ? "h-4 w-3/4" : "h-3 w-full"
              )}
            />
            {index === 0 && (
              <div className="h-3 w-1/2 bg-muted/60 rounded animate-pulse" />
            )}
          </div>
        ))}
      </div>
    );
  };

  if (variant === "minimal") {
    return (
      <Card className={cn("shadow-brand", className)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner size="md" variant="brand" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === "detailed") {
    return (
      <Card className={cn("shadow-brand", className)}>
        <CardHeader className="pb-4">
          <div className="space-y-2">
            {title && (
              <div className="h-6 w-32 bg-muted rounded animate-pulse" />
            )}
            {subtitle && (
              <div className="h-4 w-48 bg-muted/60 rounded animate-pulse" />
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center py-4">
            <LoadingSpinner size="lg" variant="brand" text="Loading data..." />
          </div>
          {renderSkeleton()}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("shadow-brand", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2 flex-1">
            {title && (
              <div className="h-5 w-24 bg-muted rounded animate-pulse" />
            )}
            {subtitle && (
              <div className="h-4 w-32 bg-muted/60 rounded animate-pulse" />
            )}
          </div>
          <div className="h-4 w-4 bg-muted rounded animate-pulse" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center py-6">
          <LoadingSpinner size="md" variant="brand" />
        </div>
        {renderSkeleton()}
      </CardContent>
    </Card>
  );
};

export default LoadingCard;
