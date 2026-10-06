import LoadingSpinner from "@/components/ui/loading-spinner";
import { cn } from "@/lib/utils";

interface ListLoadingStateProps {
  message?: string;
  className?: string;
}

const ListLoadingState = ({
  message = "Loading...",
  className,
}: ListLoadingStateProps) => {
  return (
    <div className={cn("text-center py-12", className)}>
      <LoadingSpinner size="lg" text={message} />
    </div>
  );
};

export default ListLoadingState;
