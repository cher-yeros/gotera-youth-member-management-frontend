import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ListEmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  primaryAction?: { label: string; onClick: () => void };
  secondaryAction?: { label: string; onClick: () => void };
  className?: string;
}

const ListEmptyState = ({
  icon = "👥",
  title,
  description,
  primaryAction,
  secondaryAction,
  className,
}: ListEmptyStateProps) => {
  return (
    <div className={cn("text-center py-12", className)}>
      <div className="h-16 w-16 bg-brand-gradient rounded-full mx-auto mb-4 flex items-center justify-center">
        {typeof icon === "string" ? (
          <span className="text-white text-2xl">{icon}</span>
        ) : (
          <div className="text-white">{icon}</div>
        )}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {description && (
        <p className="text-muted-foreground mb-4">{description}</p>
      )}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {primaryAction && (
          <Button
            onClick={primaryAction.onClick}
            className="bg-brand-gradient hover:opacity-90 transition-opacity"
          >
            {primaryAction.label}
          </Button>
        )}
        {secondaryAction && (
          <Button
            onClick={secondaryAction.onClick}
            variant="outline"
            className="border-primary hover:bg-primary hover:text-primary-foreground"
          >
            {secondaryAction.label}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ListEmptyState;
