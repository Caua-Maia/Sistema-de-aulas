import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors duration-200",
  {
    variants: {
      variant: {
        default:
          "bg-brand-primary/10 text-brand-primary dark:bg-brand-primary/20 dark:text-violet-300",
        secondary:
          "bg-brand-secondary/10 text-brand-secondary dark:bg-brand-secondary/15 dark:text-cyan-300",
        success:
          "bg-brand-success/10 text-brand-success dark:bg-brand-success/15 dark:text-green-300",
        muted:
          "bg-brand-card-secondary text-brand-text-muted",
        dark: "bg-brand-sidebar text-white/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { badgeVariants };
