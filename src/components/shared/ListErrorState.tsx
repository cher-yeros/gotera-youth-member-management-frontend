import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ListErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  /** page = Card wrapper for full-page errors; inline = just the content block */
  layout?: "page" | "inline";
  className?: string;
}

const ListErrorState = ({
  title = "Something went wrong",
  message = "Please try again.",
  onRetry,
  layout = "inline",
  className,
}: ListErrorStateProps) => {
  const content = (
    <div className={cn("text-center py-12", className)}>
      <div className="h-16 w-16 bg-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
        <span className="text-white text-2xl">⚠️</span>
      </div>
      <h3 className="text-lg font-semibold mb-2 text-red-600">{title}</h3>
      <p className="text-muted-foreground mb-4">{message}</p>
      {onRetry && (
        <Button
          onClick={onRetry}
          className="bg-brand-gradient hover:opacity-90 transition-opacity"
        >
          Retry
        </Button>
      )}
    </div>
  );

  if (layout === "page") {
    return (
      <Card className="shadow-brand">
        <CardContent>{content}</CardContent>
      </Card>
    );
  }

  return content;
};

export default ListErrorState;
