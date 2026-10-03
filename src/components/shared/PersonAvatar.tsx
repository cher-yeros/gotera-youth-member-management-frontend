import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { resolveMediaUrl } from "@/lib/apiOrigin";
import { cn } from "@/lib/utils";

interface PersonAvatarProps {
  name?: string | null;
  photoUrl?: string | null;
  className?: string;
}

function initialsFromName(name?: string | null): string {
  if (!name?.trim()) return "?";
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase() || "?";
}

export function PersonAvatar({ name, photoUrl, className }: PersonAvatarProps) {
  return (
    <Avatar className={cn("size-8", className)}>
      <AvatarImage src={resolveMediaUrl(photoUrl)} alt={name || "Photo"} />
      <AvatarFallback className="text-xs">
        {initialsFromName(name)}
      </AvatarFallback>
    </Avatar>
  );
}
