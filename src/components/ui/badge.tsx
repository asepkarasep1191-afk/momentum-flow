import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-2xs font-semibold tracking-wide",
  {
    variants: {
      tone: {
        neutral: "bg-surface-2 text-muted",
        up: "bg-up/15 text-up",
        down: "bg-down/15 text-down",
        accent: "bg-accent/15 text-accent",
        warn: "bg-warn/15 text-warn",
        scalp: "bg-scalp/15 text-scalp",
        swing: "bg-swing/15 text-swing",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

export function Badge({
  className,
  tone,
  ...props
}: ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
