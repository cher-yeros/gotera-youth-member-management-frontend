import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  back?: { label: string; onClick: () => void };
  className?: string;
  titleClassName?: string;
}

const PageHeader = ({
  title,
  subtitle,
  actions,
  back,
  className,
  titleClassName,
}: PageHeaderProps) => {
  return (
    <div
      className={cn(
        "flex justify-between items-center flex-wrap gap-3",
        className,
      )}
    >
      <div className="min-w-0">
        {back && (
          <Button
            variant="ghost"
            className="px-0 hover:bg-transparent mb-1"
            onClick={back.onClick}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {back.label}
          </Button>
        )}
        <h1
          className={cn(
            "text-3xl font-bold text-brand-gradient",
            titleClassName,
          )}
        >
          {title}
        </h1>
        {subtitle != null && subtitle !== "" && (
          <p className="text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center space-x-4 flex-wrap gap-2">
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
