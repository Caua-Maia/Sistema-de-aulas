import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  className?: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

export function ProgressBar({
  value,
  className,
  showLabel = false,
  size = "md",
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const heightClass =
    size === "sm" ? "h-2" : size === "lg" ? "h-3.5" : "h-2.5";

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="mb-2 flex justify-between text-sm">
          <span className="font-medium text-slate-500">Progresso</span>
          <span
            className={cn(
              "font-bold tabular-nums",
              clamped >= 100 ? "text-brand-success" : "text-brand-primary"
            )}
          >
            {clamped}%
          </span>
        </div>
      )}
      <div
        className={cn(
          "w-full overflow-hidden rounded-full bg-slate-200/80",
          heightClass
        )}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700 ease-out",
            clamped >= 100
              ? "bg-gradient-to-r from-brand-success to-emerald-400 shadow-[0_0_8px_rgba(34,197,94,0.4)]"
              : "bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-primary bg-[length:200%_100%] animate-shimmer"
          )}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
