import {
  Activity,
  AlertTriangle,
  Check,
  Copy,
  ExternalLink,
  ShieldCheck,
  Star,
  Target,
  TrendingUp,
  Wallet,
  X,
  Zap,
} from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { PriceChart } from "@/components/price-chart";
import { RiskPanel } from "@/components/risk-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSecurity } from "@/hooks/use-security";
import { useTaken } from "@/hooks/use-taken";
import { useWatchlist } from "@/hooks/use-watchlist";
import { CHAIN_BY_ID, dexScreenerPath } from "@/lib/chains";
import { formatAge, formatPct, formatPrice, formatUsd, riskReward } from "@/lib/format";
import { estimatedSecurity, isLpSafe, passesAllChecks } from "@/lib/security";
import { planToPrice, smcNote, structureRead, tradePlan } from "@/lib/signals";
import type { SecurityReport, TokenRow, TradeMode, TradePlan } from "@/lib/types";
import { cn } from "@/lib/utils";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-bg px-3 py-2.5">
      <div className="text-2xs uppercase tracking-wider text-subtle">{label}</div>
      <div className="font-mono text-sm font-semibold tabular-nums text-fg">{value}</div>
    </div>
  );
}

function Section({
  title,
  icon,
  tone = "accent",
  action,
  children,
}: {
  title: string;
  icon: ReactNode;
  tone?: "accent" | "scalp" | "swing";
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="border-b border-border px-4 py-3">
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <div
          className={cn(
            "flex items-center gap-1.5 text-2xs font-semibold uppercase tracking-wider",
            tone === "accent" && "text-accent",
            tone === "scalp" && "text-scalp",
            tone === "swing" && "text-swing",
          )}
        >
          {icon}
          {title}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function CheckRow({
  ok,
  okLabel,
  badLabel,
  sub,
}: {
  ok: boolean;
  okLabel: string;
  badLabel: string;
  sub: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-2.5 rounded-md px-3 py-2 ring-1",
        ok ? "bg-up/10 ring-up/20" : "bg-down/10 ring-down/20",
      )}
    >
      <div
        className={cn(
          "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full",
          ok ? "bg-up/20 text-up" : "bg-down/20 text-down",
        )}
      >
        {ok ? <Check className="size-3" /> : <AlertTriangle className="size-3" />}
      </div>
      <div className="min-w-0 flex-1">
        <div className={cn("text-xs font-semibold", ok ? "text-up" : "text-down")}>
          {ok ? okLabel : badLabel}
        </div>
        <div className="text-2xs text-muted">{sub}</div>
      </div>
    </div>
  );
}

function PlanGrid({
  plan,
  token,
  variant,
}: {
  plan: TradePlan;
  token: TokenRow;
  variant: "scalp" | "swing";
}) {
  const toPx = (v: number) => planToPrice(v, token.price, token.marketCap);
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <div
          className={cn(
            "rounded-md px-3 py-2 ring-1",
            variant === "scalp"
              ? "bg-scalp/10 ring-scalp/20 text-scalp"
              : "bg-swing/10 ring-swing/20 text-swing",
          )}
        >
          <div className="mb-0.5 text-2xs font-semibold uppercase tracking-wider">Entry zone</div>
          <div className="font-mono text-xs font-bold tabular-nums text-fg">
            ${formatPrice(toPx(plan.entryLow))}
            <span className="text-subtle"> / </span>
            {formatUsd(plan.entryLow)}
          </div>
          <div className="font-mono text-2xs tabular-nums text-muted">
            to ${formatPrice(toPx(plan.entryHigh))} / {formatUsd(plan.entryHigh)}
          </div>
        </div>
        <div className="rounded-md bg-down/10 px-3 py-2 ring-1 ring-down/20">
          <div className="mb-0.5 text-2xs font-semibold uppercase tracking-wider text-down">
            Stop loss
          </div>
          <div className="font-mono text-xs font-bold tabular-nums text-fg">
            ${formatPrice(toPx(plan.sl))}
            <span className="text-subtle"> / </span>
            {formatUsd(plan.sl)}
          </div>
          <div className="text-2xs font-semibold text-down">
            {formatPct(((plan.sl - token.marketCap) / token.marketCap) * 100)}
          </div>
        </div>
        <div className="rounded-md bg-up/10 px-3 py-2 ring-1 ring-up/20">
          <div className="mb-0.5 flex items-center gap-1 text-2xs font-semibold uppercase tracking-wider text-up">
            <Target className="size-3" /> TP1
          </div>
          <div className="font-mono text-xs font-bold tabular-nums text-fg">
            ${formatPrice(toPx(plan.tp1))}
            <span className="text-subtle"> / </span>
            {formatUsd(plan.tp1)}
          </div>
          <div className="text-2xs font-semibold text-up">
            {formatPct(((plan.tp1 - token.marketCap) / token.marketCap) * 100)}
          </div>
        </div>
        <div className="rounded-md bg-up/10 px-3 py-2 ring-1 ring-up/20">
          <div className="mb-0.5 flex items-center gap-1 text-2xs font-semibold uppercase tracking-wider text-up">
            <Target className="size-3" /> TP2
          </div>
          <div className="font-mono text-xs font-bold tabular-nums text-fg">
            ${formatPrice(toPx(plan.tp2))}
            <span className="text-subtle"> / </span>
            {formatUsd(plan.tp2)}
          </div>
          <div className="text-2xs font-semibold text-up">
            {formatPct(((plan.tp2 - token.marketCap) / token.marketCap) * 100)}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center justify-between rounded-md bg-bg px-3 py-1.5">
          <span className="text-2xs text-muted">R/R TP1</span>
          <span className="font-mono text-xs font-bold text-accent">
            {riskReward(token.marketCap, plan.tp1, plan.sl)}
          </span>
        </div>
        <div className="flex items-center justify-between rounded-md bg-bg px-3 py-1.5">
          <span className="text-2xs text-muted">R/R TP2</span>
          <span className="font-mono text-xs font-bold text-accent">
            {riskReward(token.marketCap, plan.tp2, plan.sl)}
          </span>
        </div>
      </div>
    </div>
  );
}

function SecurityBlock({
  report,
  loading,
  token,
}: {
  report: SecurityReport | undefined;
  loading: boolean;
  token: TokenRow;
}) {
  if (loading && !report) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }
  if (!report) return null;
  const taxOk = report.taxBuy <= 3 && report.taxSell <= 3;
  const ownerOk = report.renouncedOwnership && !report.mintable && !report.freezeable;
  const lpOk = isLpSafe(token, report);
  const allOk = passesAllChecks(token, report);
  return (
    <div className="space-y-1.5">
      {allOk ? (
        <div className="mb-2 flex items-start gap-2.5 rounded-md bg-up/10 px-3 py-2 ring-1 ring-up/20">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-up" />
          <div>
            <div className="text-xs font-semibold text-up">Passed all checks</div>
            <div className="text-2xs text-muted">Honeypot, LP, ownership, and tax are clean</div>
          </div>
        </div>
      ) : (
        <div className="mb-2 flex items-start gap-2.5 rounded-md bg-down/10 px-3 py-2 ring-1 ring-down/20">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-down" />
          <div>
            <div className="text-xs font-semibold text-down">Failed security screen</div>
            <div className="text-2xs text-muted">Does not meet every security requirement</div>
          </div>
        </div>
      )}
      <CheckRow
        ok={!report.honeypot}
        okLabel="No honeypot"
        badLabel="Honeypot risk"
        sub={report.honeypot ? "Token may not be sellable" : "Sells appear possible"}
      />
      <CheckRow
        ok={lpOk}
        okLabel={report.lpLocked ? `LP locked · ${report.lpLockedPercent}%` : "LP deep / aged"}
        badLabel="LP not locked"
        sub={
          report.lpLocked
            ? "From GoPlus lock / burn data"
            : lpOk
              ? "Aged pool with deep liquidity"
              : report.source === "goplus"
                ? "New or thin pool — lock / burn required"
                : "Estimated from pool size"
        }
      />
      <CheckRow
        ok={ownerOk}
        okLabel="Ownership / mint safe"
        badLabel={
          report.freezeable
            ? "Freeze authority active"
            : report.mintable
              ? "Mint authority active"
              : "Ownership not renounced"
        }
        sub={
          report.freezeable
            ? "Freeze authority still enabled"
            : "Owner cannot freely mint"
        }
      />
      <CheckRow
        ok={taxOk}
        okLabel={`Buy/Sell tax · ${report.taxBuy.toFixed(1)}/${report.taxSell.toFixed(1)}%`}
        badLabel={`High tax · ${report.taxBuy.toFixed(1)}/${report.taxSell.toFixed(1)}%`}
        sub={taxOk ? "Taxes within a 3% band" : "Taxes exceed 3%"}
      />
      <div className="mt-2 flex items-center justify-between rounded-md bg-bg px-3 py-2">
        <span className="text-xs text-muted">Top 10 holders</span>
        <span
          className={cn(
            "font-mono text-xs font-bold tabular-nums",
            report.topHoldersPercent <= 0
              ? "text-muted"
              : report.topHoldersPercent > 25
                ? "text-warn"
                : "text-accent",
          )}
        >
          {report.topHoldersPercent <= 0 ? "n/a" : `${report.topHoldersPercent.toFixed(1)}%`}
        </span>
      </div>
      <p className="pt-1 text-2xs text-subtle">
        {report.source === "goplus"
          ? "Contract scan via GoPlus Labs."
          : (report.notes[0] ?? "Estimated checks only.")}
      </p>
    </div>
  );
}

function StructureCard({ token, mode }: { token: TokenRow; mode: TradeMode }) {
  const read = structureRead(token, mode);
  const tone =
    read.bias === "Pullback long" ? "bg-up/15 text-up" : read.bias === "Skip" ? "bg-down/15 text-down" : "bg-warn/15 text-warn";
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className={cn("rounded-md px-1.5 py-0.5 text-2xs font-semibold", tone)}>{read.bias}</span>
        <span className="text-xs font-semibold text-fg">{read.label}</span>
      </div>
      <p className="text-2xs leading-relaxed text-muted">{read.why}</p>
      {read.actionable ? (
        <div className="grid grid-cols-2 gap-2">
          <Level label="Entry" value={`$${formatPrice(read.entryLow)} – $${formatPrice(read.entryHigh)}`} />
          <Level label="Stop" value={`$${formatPrice(read.sl)}`} down />
          <Level label="TP1" value={`$${formatPrice(read.tp1)}`} />
          <Level label="TP2" value={`$${formatPrice(read.tp2)}`} />
        </div>
      ) : (
        <div className="rounded-md bg-bg px-3 py-2 text-2xs text-subtle">
          Entry — · Stop — · No trade until the structure changes.
        </div>
      )}
    </div>
  );
}

function Level({ label, value, down }: { label: string; value: string; down?: boolean }) {
  return (
    <div className={cn("rounded-md px-3 py-2 ring-1", down ? "bg-down/10 ring-down/20" : "bg-bg ring-border")}>
      <div className={cn("text-2xs font-semibold uppercase tracking-wider", down ? "text-down" : "text-subtle")}>
        {label}
      </div>
      <div className="font-mono text-xs font-semibold tabular-nums text-fg">{value}</div>
    </div>
  );
}

function DetailRow({ label, value, up }: { label: string; value: string; up?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted">{label}</span>
      <span className={cn("text-xs font-semibold", up ? "text-accent" : "text-fg/80")}>
        {value}
      </span>
    </div>
  );
}

function copyPlan(token: TokenRow, mode: TradeMode) {
  const plan = tradePlan(token.marketCap, mode);
  const toPx = (v: number) => planToPrice(v, token.price, token.marketCap);
  const lines = [
    `MomentumFlow · ${token.symbol} · ${mode}`,
    `Chain  ${token.chain}`,
    `Price  $${formatPrice(token.price)}  Mcap ${formatUsd(token.marketCap)}`,
    `Signal ${token.smcSignal} · ${token.signalStrength}/100`,
    `Entry  $${formatPrice(toPx(plan.entryLow))} – $${formatPrice(toPx(plan.entryHigh))}`,
    `SL     $${formatPrice(toPx(plan.sl))}  (${formatPct(((plan.sl - token.marketCap) / token.marketCap) * 100)})`,
    `TP1    $${formatPrice(toPx(plan.tp1))}  (${formatPct(((plan.tp1 - token.marketCap) / token.marketCap) * 100)})  ${riskReward(token.marketCap, plan.tp1, plan.sl)}`,
    `TP2    $${formatPrice(toPx(plan.tp2))}  (${formatPct(((plan.tp2 - token.marketCap) / token.marketCap) * 100)})  ${riskReward(token.marketCap, plan.tp2, plan.sl)}`,
    `CA     ${token.ca}`,
    "Not financial advice.",
  ];
  return navigator.clipboard.writeText(lines.join("\n"));
}

export function TokenDetail({
  token,
  mode,
  onClose,
  onTaken,
}: {
  token: TokenRow;
  mode: TradeMode;
  onClose: () => void;
  onTaken?: () => void;
}) {
  const chain = CHAIN_BY_ID[token.chain];
  const scalp = tradePlan(token.marketCap, "scalping");
  const swing = tradePlan(token.marketCap, "swing");
  const securityQuery = useSecurity(token.source === "dex" ? token : null);
  const fallback = estimatedSecurity(
    token.liquidity,
    token.buys24h + token.sells24h > 0
      ? Math.min((token.sells24h / (token.buys24h + token.sells24h)) * 100, 40)
      : 15,
  );
  const report = token.source === "dex" ? securityQuery.data : fallback;
  const watched = useWatchlist((s) => s.ids.includes(token.id));
  const toggle = useWatchlist((s) => s.toggle);
  const take = useTaken((s) => s.take);
  const taken = useTaken((s) => s.has(token.id, mode));
  const [copied, setCopied] = useState(false);
  const dexUrl =
    token.source === "dex"
      ? dexScreenerPath(token.chain, token.pairAddress || token.ca)
      : `https://www.coingecko.com/en/coins/${token.ca}`;

  const buys = token.buys24h;
  const sells = token.sells24h;
  const flow = buys + sells;
  const buyPct = flow > 0 ? (buys / flow) * 100 : 50;
  const activePlan = mode === "scalping" ? scalp : swing;

  return (
    <div className="flex max-h-[80vh] flex-col overflow-hidden rounded-xl border border-border bg-surface lg:max-h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex min-w-0 items-center gap-2.5">
          {token.imageUrl ? (
            <img
              src={token.imageUrl}
              alt=""
              className="size-9 rounded-md object-cover ring-1 ring-border"
            />
          ) : (
            <div className="flex size-9 items-center justify-center rounded-md bg-surface-2 text-2xs font-bold text-accent ring-1 ring-border">
              {chain.short}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-fg">{token.symbol}</span>
              <Badge tone={token.priceChange24h >= 0 ? "up" : "down"}>
                {formatPct(token.priceChange24h)}
              </Badge>
              {token.signalAt ? (
                <Badge tone={Date.now() - token.signalAt < 5 * 60_000 ? "warn" : "neutral"}>
                  {formatAge(token.signalAt)}
                </Badge>
              ) : token.pairCreatedAt ? (
                <Badge tone="neutral">{formatAge(token.pairCreatedAt)}</Badge>
              ) : null}
            </div>
            <span className="text-2xs text-muted">
              {token.name} · {chain.name}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Copy plan"
            onClick={() => {
              take(token, mode);
              void copyPlan(token, mode).then(() => {
                setCopied(true);
                onTaken?.();
                setTimeout(() => setCopied(false), 1400);
              });
            }}
            className={copied ? "text-accent" : ""}
          >
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Watchlist"
            onClick={() => toggle(token.id)}
            className={watched ? "text-warn" : ""}
          >
            <Star className="size-4" fill={watched ? "currentColor" : "none"} />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Close" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-3 gap-px bg-border">
          <Stat label="Price" value={`$${formatPrice(token.price)}`} />
          <Stat label="Mcap" value={formatUsd(token.marketCap)} />
          <Stat label="Liquidity" value={formatUsd(token.liquidity)} />
        </div>

        {flow > 0 ? (
          <div className="border-b border-border px-4 py-3">
            <div className="mb-1.5 flex justify-between text-2xs text-muted">
              <span>Buy {buyPct.toFixed(0)}%</span>
              <span>Sell {(100 - buyPct).toFixed(0)}%</span>
            </div>
            <div className="flex h-1.5 overflow-hidden rounded-full bg-down/40">
              <div className="h-full bg-up" style={{ width: `${buyPct}%` }} />
            </div>
          </div>
        ) : null}

        <PriceChart token={token} mode={mode} />

        <Section title="Security checks" icon={<ShieldCheck className="size-3.5" />}>
          <SecurityBlock token={token} report={report} loading={securityQuery.isLoading} />
        </Section>

        <Section
          title="Scalping plan · 5m / 15m"
          icon={<Zap className="size-3.5" />}
          tone="scalp"
        >
          <PlanGrid plan={scalp} token={token} variant="scalp" />
        </Section>

        <Section
          title="Swing plan · 1H / 4H"
          icon={<TrendingUp className="size-3.5" />}
          tone="swing"
        >
          <PlanGrid plan={swing} token={token} variant="swing" />
        </Section>

        <div className="px-4 pb-2 pt-3">
          <div
            className={cn(
              "flex items-center justify-center gap-1.5 rounded-md py-1.5 text-2xs font-medium ring-1",
              mode === "scalping"
                ? "bg-scalp/10 text-scalp ring-scalp/20"
                : "bg-swing/10 text-swing ring-swing/20",
            )}
          >
            <span className="size-1.5 rounded-full bg-current" />
            Active mode: {mode === "scalping" ? "Scalping 5m/15m" : "Swing 1H/4H"} · R/R{" "}
            {riskReward(token.marketCap, activePlan.tp1, activePlan.sl)}
          </div>
          <Button
            className="mt-2 w-full"
            variant={taken ? "subtle" : "default"}
            onClick={() => {
              take(token, mode);
              onTaken?.();
            }}
          >
            {taken ? "Saved on Active tape" : "Take this signal"}
          </Button>
          <p className="mt-1.5 text-center text-2xs text-subtle">
            Pins entry / TP / SL so a new print does not wipe this trade.
          </p>
        </div>

        <Section title="Position size" icon={<Wallet className="size-3.5" />}>
          <RiskPanel token={token} mode={mode} />
        </Section>

        <Section title="Structure read" icon={<Activity className="size-3.5" />}>
          <StructureCard token={token} mode={mode} />
        </Section>

        <Section title="Signal details" icon={<Activity className="size-3.5" />}>
          <div className="space-y-2">
            <DetailRow label="SMC signal" value={token.smcSignal} />
            <p className="text-2xs leading-relaxed text-muted">{smcNote(token.smcSignal)}</p>
            <DetailRow label="Signal strength" value={`${token.signalStrength}/100`} up />
            <DetailRow
              label="Price change 5m"
              value={formatPct(token.priceChange5m, 2)}
              up={token.priceChange5m > 0}
            />
            <DetailRow
              label="Price change 1h"
              value={formatPct(token.priceChange1h, 2)}
              up={token.priceChange1h > 0}
            />
            <DetailRow
              label="Price change 6h"
              value={formatPct(token.priceChange6h, 2)}
              up={token.priceChange6h > 0}
            />
            <DetailRow
              label="Price change 24h"
              value={formatPct(token.priceChange24h, 2)}
              up={token.priceChange24h > 0}
            />
            <DetailRow label="24h volume" value={formatUsd(token.volume24h)} />
            <DetailRow label="Vol ratio vs avg" value={`${token.volumeRatio.toFixed(1)}x`} up />
            {token.signalAt ? (
              <DetailRow label="Signal appeared" value={`${formatAge(token.signalAt)} ago`} />
            ) : null}
            {token.pairCreatedAt ? (
              <DetailRow label="Pair age" value={formatAge(token.pairCreatedAt)} />
            ) : null}
          </div>
          <p className="mt-3 text-2xs leading-relaxed text-subtle">
            SMC labels are momentum heuristics from price and volume, not order-book SMC. Not
            financial advice.
          </p>
        </Section>

        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="text-2xs uppercase tracking-wider text-subtle">
              {token.source === "dex" ? "Contract" : "Market id"}
            </span>
            <a
              href={dexUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-2xs text-muted hover:text-fg"
            >
              <ExternalLink className="size-3" />
              {token.source === "dex" ? "DexScreener" : "CoinGecko"}
            </a>
          </div>
          <p className="mt-1 break-all font-mono text-2xs text-muted">{token.ca}</p>
        </div>
      </div>
    </div>
  );
}
