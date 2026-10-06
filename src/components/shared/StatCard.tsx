import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

type StatTone =
  | "default"
  | "primary"
  | "secondary"
  | "accent"
  | "success"
  | "warning"
  | "danger"
  | "muted";

type StatVariant = "default" | "compact" | "row";

interface StatCardProps {
  title: string;
  value: ReactNode;
  description?: ReactNode;
  icon?: LucideIcon;
  tone?: StatTone;
  variant?: StatVariant;
  href?: string;
  linkLabel?: string;
  footer?: ReactNode;
  className?: string;
  valueClassName?: string;
}

const toneStyles: Record<
  StatTone,
  {
    iconWrap: string;
    icon: string;
    wash: string;
    ring: string;
  }
> = {
  default: {
    iconWrap: "bg-primary/10",
    icon: "text-primary",
    wash: "from-primary/10 via-transparent to-transparent",
    ring: "hover:border-primary/25",
  },
  primary: {
    iconWrap: "bg-primary/10",
    icon: "text-primary",
    wash: "from-primary/10 via-transparent to-transparent",
    ring: "hover:border-primary/25",
  },
  secondary: {
    iconWrap: "bg-secondary/15",
    icon: "text-secondary",
    wash: "from-secondary/15 via-transparent to-transparent",
    ring: "hover:border-secondary/30",
  },
  accent: {
    iconWrap: "bg-violet-500/10",
    icon: "text-violet-600 dark:text-violet-400",
    wash: "from-violet-500/10 via-transparent to-transparent",
    ring: "hover:border-violet-500/30",
  },
  success: {
    iconWrap: "bg-emerald-500/10",
    icon: "text-emerald-600 dark:text-emerald-400",
    wash: "from-emerald-500/10 via-transparent to-transparent",
    ring: "hover:border-emerald-500/30",
  },
  warning: {
    iconWrap: "bg-amber-500/10",
    icon: "text-amber-600 dark:text-amber-400",
    wash: "from-amber-500/10 via-transparent to-transparent",
    ring: "border-amber-500/35 hover:border-amber-500/50",
  },
  danger: {
    iconWrap: "bg-red-500/10",
    icon: "text-red-600 dark:text-red-400",
    wash: "from-red-500/10 via-transparent to-transparent",
    ring: "border-red-500/35 hover:border-red-500/50",
  },
  muted: {
    iconWrap: "bg-muted",
    icon: "text-muted-foreground",
    wash: "from-muted via-transparent to-transparent",
    ring: "hover:border-border",
  },
};

const StatCard = ({
  title,
  value,
  description,
  icon,
  tone = "default",
  variant = "default",
  href,
  linkLabel,
  footer,
  className,
  valueClassName,
}: StatCardProps) => {
  const styles = toneStyles[tone];
  const Icon = icon;
  const isCompact = variant === "compact";
  const isRow = variant === "row";

  const iconNode = Icon ? (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-xl",
        "ring-1 ring-inset ring-black/5 dark:ring-white/10",
        "transition-transform duration-300 group-hover:scale-105",
        styles.iconWrap,
        isCompact ? "h-8 w-8 rounded-lg" : isRow ? "h-10 w-10" : "h-11 w-11",
      )}
    >
      <Icon className={cn(isCompact ? "h-4 w-4" : "h-5 w-5", styles.icon)} />
    </div>
  ) : null;

  const linkNode = href ? (
    <Link
      to={href}
      className="inline-flex text-xs font-medium text-primary transition-colors hover:text-primary/80"
    >
      {linkLabel || "View details"}
    </Link>
  ) : null;

  return (
    <div
      className={cn(
        "group relative overflow-hidden border bg-card shadow-sm",
        "transition-all duration-300 ease-out",
        isCompact
          ? "rounded-xl p-3.5"
          : isRow
            ? "rounded-xl p-4 hover:shadow-sm"
            : "rounded-2xl p-5 hover:-translate-y-0.5 hover:shadow-brand",
        styles.ring,
        className,
      )}
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-80",
          styles.wash,
        )}
      />
      {!isCompact && (
        <div
          aria-hidden
          className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/5 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
        />
      )}

      {isRow ? (
        <div className="relative flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            {iconNode}
            <div className="min-w-0 text-left">
              <p className="truncate text-sm font-semibold text-foreground">
                {title}
              </p>
              {description && (
                <p className="truncate text-xs text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
          </div>
          <div className="shrink-0 text-right">
            <div
              className={cn(
                "text-2xl font-bold tracking-tight tabular-nums text-foreground",
                valueClassName,
              )}
            >
              {value}
            </div>
            {linkNode}
            {footer}
          </div>
        </div>
      ) : (
        <>
          <div className="relative flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-1">
              <p
                className={cn(
                  "font-medium uppercase tracking-wider text-muted-foreground",
                  isCompact ? "text-[10px]" : "text-xs",
                )}
              >
                {title}
              </p>
              <div
                className={cn(
                  "font-bold tracking-tight text-foreground tabular-nums",
                  isCompact ? "text-xl" : "text-3xl",
                  valueClassName,
                )}
              >
                {value}
              </div>
            </div>
            {iconNode}
          </div>

          {(description || href || footer) && (
            <div
              className={cn(
                "relative space-y-1.5",
                isCompact ? "mt-2" : "mt-3",
              )}
            >
              {description && (
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {description}
                </p>
              )}
              {linkNode}
              {footer}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StatCard;
export type { StatCardProps, StatTone, StatVariant };
