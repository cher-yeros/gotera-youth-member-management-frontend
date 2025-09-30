import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import LoadingSpinner from "./loading-spinner";
import { Users, Home, Briefcase, MapPin } from "lucide-react";

interface LoadingPageProps {
  title?: string;
  subtitle?: string;
  showStats?: boolean;
  className?: string;
}

const LoadingPage: React.FC<LoadingPageProps> = ({
  title = "Gotera Youth",
  subtitle = "Member Management System",
  showStats = true,
  className,
}) => {
  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4 ${className}`}
    >
      <div className="w-full max-w-2xl">
        {/* Main Loading Card */}
        <Card className="shadow-brand-lg border-0 bg-card/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              {/* Logo/Brand Section */}
              <div className="space-y-4">
                <div className="h-16 w-16 bg-brand-gradient rounded-2xl mx-auto flex items-center justify-center shadow-brand">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold text-brand-gradient">
                    {title}
                  </h1>
                  <p className="text-muted-foreground text-lg">{subtitle}</p>
                </div>
              </div>

              {/* Loading Spinner */}
              <div className="py-4">
                <LoadingSpinner size="lg" variant="brand" text="Loading..." />
              </div>

              {/* Stats Preview (if enabled) */}
              {showStats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                  <div className="text-center space-y-2">
                    <div className="h-8 w-8 bg-primary/10 rounded-lg mx-auto flex items-center justify-center">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <div className="h-4 w-12 bg-muted rounded animate-pulse mx-auto"></div>
                      <div className="h-3 w-16 bg-muted/60 rounded animate-pulse mx-auto"></div>
                    </div>
                  </div>

                  <div className="text-center space-y-2">
                    <div className="h-8 w-8 bg-secondary/10 rounded-lg mx-auto flex items-center justify-center">
                      <Home className="h-4 w-4 text-secondary" />
                    </div>
                    <div className="space-y-1">
                      <div className="h-4 w-12 bg-muted rounded animate-pulse mx-auto"></div>
                      <div className="h-3 w-16 bg-muted/60 rounded animate-pulse mx-auto"></div>
                    </div>
                  </div>

                  <div className="text-center space-y-2">
                    <div className="h-8 w-8 bg-accent/10 rounded-lg mx-auto flex items-center justify-center">
                      <Briefcase className="h-4 w-4 text-accent" />
                    </div>
                    <div className="space-y-1">
                      <div className="h-4 w-12 bg-muted rounded animate-pulse mx-auto"></div>
                      <div className="h-3 w-16 bg-muted/60 rounded animate-pulse mx-auto"></div>
                    </div>
                  </div>

                  <div className="text-center space-y-2">
                    <div className="h-8 w-8 bg-primary/10 rounded-lg mx-auto flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <div className="h-4 w-12 bg-muted rounded animate-pulse mx-auto"></div>
                      <div className="h-3 w-16 bg-muted/60 rounded animate-pulse mx-auto"></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Progress Indicator */}
              <div className="pt-4">
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div className="h-full bg-brand-gradient rounded-full animate-pulse"></div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Initializing your dashboard...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 h-2 w-2 bg-primary/20 rounded-full animate-ping"></div>
          <div className="absolute top-1/3 right-1/4 h-1 w-1 bg-secondary/20 rounded-full animate-ping delay-300"></div>
          <div className="absolute bottom-1/4 left-1/3 h-1.5 w-1.5 bg-accent/20 rounded-full animate-ping delay-700"></div>
          <div className="absolute bottom-1/3 right-1/3 h-1 w-1 bg-primary/20 rounded-full animate-ping delay-1000"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
