import type { SmcSignal } from "@/lib/types";
import { structureRead } from "@/lib/signals";
import type { TokenRow } from "@/lib/types";
import { cn } from "@/lib/utils";

const TONE: Record<SmcSignal, string> = {
  "Bullish OB + FVG": "bg-accent/15 text-accent ring-accent/30",
  "Bullish OB": "bg-scalp/15 text-scalp ring-scalp/25",
  "Unfilled FVG": "bg-swing/15 text-swing ring-swing/25",
  Distribution: "bg-down/15 text-down ring-down/25",
};

const DOT: Record<SmcSignal, string> = {
  "Bullish OB + FVG": "bg-accent",
  "Bullish OB": "bg-scalp",
  "Unfilled FVG": "bg-swing",
  Distribution: "bg-down",
};

export function SignalBadge({
  token,
}: {
  token: TokenRow;
}) {
  const signal = token.smcSignal;
  const strength = token.signalStrength;
  const read = structureRead(token);
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <span
        className={cn(
          "inline-flex w-fit items-center gap-1 rounded-md px-1.5 py-0.5 text-2xs font-semibold ring-1",
          TONE[signal],
        )}
      >
        <span className={cn("size-1 rounded-full", DOT[signal])} />
        {signal}
      </span>
      <div className="flex items-center gap-1.5">
        <div className="h-1 w-12 overflow-hidden rounded-full bg-border">
          <div
            className={cn(
              "h-full rounded-full",
              strength >= 90 ? "bg-accent" : strength >= 75 ? "bg-warn" : "bg-muted",
            )}
            style={{ width: `${strength}%` }}
          />
        </div>
        <span className="font-mono text-2xs tabular-nums text-subtle">{strength}</span>
      </div>
      <span
        className={cn(
          "text-2xs font-semibold",
          read.bias === "Pullback long" && "text-up",
          read.bias === "Skip" && "text-down",
          read.bias === "Stand aside" && "text-warn",
        )}
      >
        {read.bias} · {read.label}
      </span>
    </div>
  );
}
