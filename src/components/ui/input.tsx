import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      suppressHydrationWarning
      className={cn(
        "h-10 w-full rounded-md border border-border bg-surface px-3 text-sm text-fg placeholder:text-subtle outline-none transition-colors duration-[var(--motion-quick)] focus:border-accent/40 focus:ring-2 focus:ring-accent/15",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
