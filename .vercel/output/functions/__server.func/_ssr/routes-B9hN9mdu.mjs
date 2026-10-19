import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { r as require_jsx_runtime, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { S as Activity, _ as Check, a as TrendingUp, b as ArrowUp, c as ShieldCheck, d as Pin, f as Percent, g as Copy, h as ExternalLink, i as TriangleAlert, l as Search, m as Inbox, n as X, o as Target, p as LoaderCircle, r as Wallet, s as Star, t as Zap, u as RefreshCw, v as ChartColumn, x as ArrowDown, y as BookmarkX } from "../_libs/lucide-react.mjs";
import { t as createServerFn } from "./ssr.mjs";
import { n as CHAIN_BY_ID, r as dexScreenerPath, t as CHAINS } from "./chains-DJv5KIuX.mjs";
import { a as fetchTokenSecurity, c as passesAllChecks, d as smcNote, f as tradePlan, i as estimatedSecurity, l as planToPrice, n as createSsrRpc, o as isLpSafe, s as matchesPreset, u as scoreForMode } from "./security-9NnIWGF5.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { n as persist, r as create, t as createJSONStorage } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-B9hN9mdu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function ScreenerHeader({ mode, onModeChange, activeChains, onToggleChain, onSelectAll, resultCount }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur-xl",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-screen-2xl flex-col gap-3 px-4 py-3 lg:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex size-10 items-center justify-center rounded-lg bg-accent/15 ring-1 ring-accent/30",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
							viewBox: "0 0 24 24",
							className: "size-5 text-accent",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "2.4",
							strokeLinecap: "round",
							strokeLinejoin: "round",
							"aria-hidden": true,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M3 17l6-6 4 4 7-7" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M14 8h5v5" })]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "text-sm font-semibold tracking-tight text-fg",
							children: ["Momentum", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-accent",
								children: "Flow"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-2xs text-muted",
							children: "DeFi momentum screener"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1 rounded-lg bg-surface p-1 ring-1 ring-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => onModeChange("scalping"),
						className: cn("flex min-h-10 items-center gap-1.5 rounded-md px-3 text-xs font-semibold transition-colors duration-[var(--motion-quick)]", mode === "scalping" ? "bg-scalp/15 text-scalp ring-1 ring-scalp/30" : "text-muted hover:text-fg"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, {
								className: "size-3.5",
								fill: mode === "scalping" ? "currentColor" : "none"
							}),
							"Scalp",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden text-2xs opacity-60 sm:inline",
								children: "5m/15m"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => onModeChange("swing"),
						className: cn("flex min-h-10 items-center gap-1.5 rounded-md px-3 text-xs font-semibold transition-colors duration-[var(--motion-quick)]", mode === "swing" ? "bg-swing/15 text-swing ring-1 ring-swing/30" : "text-muted hover:text-fg"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "size-3.5" }),
							"Swing",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden text-2xs opacity-60 sm:inline",
								children: "1H/4H"
							})
						]
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-1.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mr-1 text-2xs font-medium uppercase tracking-wider text-subtle",
						children: "Chains"
					}),
					CHAINS.map((chain) => {
						const on = activeChains.has(chain.id);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => onToggleChain(chain.id),
							className: cn("flex min-h-10 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium ring-1 transition-colors duration-[var(--motion-quick)]", on ? "bg-surface-2 text-fg ring-border-strong" : "text-subtle ring-border hover:text-muted"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-1.5 rounded-full", on ? "bg-accent" : "bg-subtle") }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "sm:hidden",
									children: chain.short
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden sm:inline",
									children: chain.name
								})
							]
						}, chain.id);
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onSelectAll,
						className: "min-h-10 rounded-md px-2.5 text-2xs font-medium text-muted hover:text-fg",
						children: activeChains.size === CHAINS.length ? "Clear" : "All"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ml-auto flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1.5 text-2xs text-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "relative flex size-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-70" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative inline-flex size-1.5 rounded-full bg-accent" })]
							}), "Live"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "rounded-md bg-surface-2 px-2 py-0.5 font-mono text-2xs font-semibold tabular-nums text-muted",
							children: [resultCount, " signals"]
						})]
					})
				]
			})]
		})
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md font-medium transition-colors duration-[var(--motion-quick)] ease-[var(--ease-out)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-3.5 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-accent text-accent-fg hover:bg-accent/90",
			ghost: "text-muted hover:bg-surface-2 hover:text-fg",
			outline: "border border-border bg-transparent text-fg hover:bg-surface-2",
			subtle: "bg-surface-2 text-fg hover:bg-border"
		},
		size: {
			default: "h-10 px-3.5 text-sm",
			sm: "h-8 px-2.5 text-xs",
			icon: "size-8"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		ref,
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		...props
	});
});
Button.displayName = "Button";
var Input = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
	ref,
	suppressHydrationWarning: true,
	className: cn("h-10 w-full rounded-md border border-border bg-surface px-3 text-sm text-fg placeholder:text-subtle outline-none transition-colors duration-[var(--motion-quick)] focus:border-accent/40 focus:ring-2 focus:ring-accent/15", className),
	...props
}));
Input.displayName = "Input";
var PRESETS = [
	{
		id: "momentum",
		label: "Momentum"
	},
	{
		id: "spike",
		label: "Vol spike"
	},
	{
		id: "heat",
		label: "Heat"
	},
	{
		id: "liquid",
		label: "Liquid"
	},
	{
		id: "active",
		label: "Active"
	},
	{
		id: "watch",
		label: "Watchlist"
	},
	{
		id: "all",
		label: "All"
	}
];
function ScreenerToolbar({ query, onQuery, preset, onPreset, source, fetchedAt, refreshing, onRefresh, watchCount, takenCount, breadth, secureOnly, onSecureOnly, securePassed, scanned }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-4 flex flex-col gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative min-w-0 flex-1 sm:max-w-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: query,
					onChange: (e) => onQuery(e.target.value),
					placeholder: "Search symbol, name, or contract…",
					className: "pl-9"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 text-2xs text-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "hidden items-center gap-1.5 sm:flex",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "size-3.5" }), source === "market" ? "Market data" : source === "dex" ? "Live DEX pairs" : "Connecting"]
					}),
					fetchedAt ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden font-mono tabular-nums sm:inline",
						children: new Date(fetchedAt).toLocaleTimeString()
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						size: "sm",
						onClick: onRefresh,
						disabled: refreshing,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: cn("size-3", refreshing && "animate-spin") }), "Refresh"]
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center gap-1.5",
			children: [
				PRESETS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => onPreset(p.id),
					className: cn("min-h-10 rounded-md px-3 text-xs font-medium ring-1 transition-colors duration-[var(--motion-quick)]", preset === p.id ? "bg-accent/15 text-accent ring-accent/30" : "text-muted ring-border hover:text-fg"),
					children: [
						p.label,
						p.id === "watch" && watchCount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-1.5 font-mono text-2xs tabular-nums opacity-70",
							children: watchCount
						}) : null,
						p.id === "active" && takenCount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-1.5 font-mono text-2xs tabular-nums opacity-70",
							children: takenCount
						}) : null
					]
				}, p.id)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => onSecureOnly(!secureOnly),
					className: cn("ml-0 flex min-h-10 items-center gap-1.5 rounded-md px-3 text-xs font-medium ring-1 transition-colors duration-[var(--motion-quick)] sm:ml-2", secureOnly ? "bg-accent/15 text-accent ring-accent/30" : "text-muted ring-border hover:text-fg"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-3.5" }),
						"Pass all checks",
						scanned > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono text-2xs tabular-nums opacity-70",
							children: [
								securePassed,
								"/",
								scanned
							]
						}) : null
					]
				}),
				breadth.up + breadth.down > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "ml-auto hidden items-center gap-2 font-mono text-2xs tabular-nums text-muted xl:flex",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-up",
							children: [breadth.up, " up"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-subtle",
							children: "/"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-down",
							children: [breadth.down, " down"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-subtle",
							children: "· med"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: breadth.median >= 0 ? "text-up" : "text-down",
							children: [
								breadth.median >= 0 ? "+" : "",
								breadth.median.toFixed(1),
								"%"
							]
						})
					]
				}) : null
			]
		})]
	});
}
function formatPrice(value) {
	if (!Number.isFinite(value) || value <= 0) return "—";
	if (value >= 1e3) return value.toLocaleString("en-US", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	});
	if (value >= 1) return value.toFixed(3);
	if (value >= .01) return value.toFixed(5);
	if (value >= 1e-4) return value.toFixed(7);
	return value.toPrecision(4);
}
function formatUsd(value) {
	if (!Number.isFinite(value) || value <= 0) return "—";
	const abs = Math.abs(value);
	if (abs >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
	if (abs >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
	if (abs >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
	return `$${value.toFixed(2)}`;
}
function formatPct(value, digits = 1) {
	if (!Number.isFinite(value)) return "—";
	if (value >= 1e3) return ">+999%";
	if (value <= -1e3) return "<-999%";
	return `${value > 0 ? "+" : ""}${value.toFixed(digits)}%`;
}
function shortAddress(value) {
	if (value.length <= 12) return value;
	return `${value.slice(0, 6)}…${value.slice(-4)}`;
}
function formatAge(createdAt, now = Date.now()) {
	if (!createdAt) return "—";
	const ms = now - createdAt;
	if (ms < 0) return "<1m";
	const min = Math.floor(ms / 6e4);
	if (min < 1) return "<1m";
	if (min < 60) return `${min}m`;
	const hr = Math.floor(min / 60);
	if (hr < 48) return `${hr}h`;
	const day = Math.floor(hr / 24);
	if (day < 60) return `${day}d`;
	return `${Math.floor(day / 30)}mo`;
}
function formatClock(at) {
	if (!at) return "—";
	return new Date(at).toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit"
	});
}
function signalFreshness(signalAt, now = Date.now()) {
	if (!signalAt) return "unknown";
	const ms = now - signalAt;
	if (ms < 3e5) return "new";
	if (ms < 18e5) return "fresh";
	return "old";
}
function riskReward(entry, target, stop) {
	const risk = Math.abs(entry - stop);
	if (risk <= 0) return "—";
	return `1:${((target - entry) / risk).toFixed(1)}`;
}
function ChangeCell({ value, emphasize }) {
	const up = value > 0;
	const down = value < 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("font-mono text-xs tabular-nums", up && "text-up", down && "text-down", !up && !down && "text-muted", emphasize && "font-semibold"),
		children: formatPct(value)
	});
}
var MAX$1 = 40;
function takenKey(tokenId, mode) {
	return `${tokenId}:${mode}`;
}
function takenStatus(price, item) {
	if (!(price > 0)) return "open";
	if (price <= item.sl) return "sl";
	if (price >= item.tp2) return "tp2";
	if (price >= item.tp1) return "tp1";
	return "open";
}
var useTaken = create()(persist((set, get) => ({
	items: [],
	take: (token, mode) => {
		const plan = tradePlan(token.marketCap, mode);
		const next = {
			key: takenKey(token.id, mode),
			takenAt: Date.now(),
			mode,
			token: {
				...token,
				security: void 0
			},
			entry: token.price,
			tp1: planToPrice(plan.tp1, token.price, token.marketCap),
			tp2: planToPrice(plan.tp2, token.price, token.marketCap),
			sl: planToPrice(plan.sl, token.price, token.marketCap)
		};
		set((state) => ({ items: [next, ...state.items.filter((x) => x.key !== next.key)].slice(0, MAX$1) }));
	},
	drop: (key) => set((state) => ({ items: state.items.filter((x) => x.key !== key) })),
	has: (tokenId, mode) => get().items.some((x) => x.key === takenKey(tokenId, mode))
}), { name: "momentumflow-taken" }));
var STATUS = {
	open: {
		label: "In play",
		className: "bg-accent/15 text-accent"
	},
	tp1: {
		label: "TP1 hit",
		className: "bg-up/15 text-up"
	},
	tp2: {
		label: "TP2 hit",
		className: "bg-up/15 text-up"
	},
	sl: {
		label: "SL hit",
		className: "bg-down/15 text-down"
	}
};
function TakenList({ items, liveById, selectedId, onSelect, onDrop }) {
	if (items.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-64 flex-col items-center justify-center gap-3 rounded-xl border border-border bg-surface text-muted",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inbox, { className: "size-8" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "max-w-sm text-center text-sm",
			children: "Take a signal from the plan panel. It stays here until you drop it — even if a new tape print replaces it."
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "overflow-hidden rounded-xl border border-border bg-surface",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "hidden grid-cols-[minmax(0,1.2fr)_0.7fr_0.7fr_0.7fr_auto] gap-3 border-b border-border bg-bg/40 px-3 py-2 lg:grid",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "pl-8 text-2xs font-semibold uppercase tracking-wider text-subtle",
					children: "Taken signal"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-right text-2xs font-semibold uppercase tracking-wider text-subtle",
					children: "Entry / now"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-right text-2xs font-semibold uppercase tracking-wider text-subtle",
					children: "TP / SL"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-right text-2xs font-semibold uppercase tracking-wider text-subtle",
					children: "Taken"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-right text-2xs font-semibold uppercase tracking-wider text-subtle",
					children: "Status"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "divide-y divide-border",
			children: items.map((item) => {
				const live = liveById.get(item.token.id);
				const token = live ? {
					...item.token,
					...live,
					smcSignal: item.token.smcSignal,
					signalStrength: item.token.signalStrength
				} : item.token;
				const price = live?.price ?? item.token.price;
				const meta = STATUS[takenStatus(price, item)];
				const pnl = item.entry > 0 ? (price - item.entry) / item.entry * 100 : 0;
				const chain = CHAIN_BY_ID[item.token.chain];
				const selected = selectedId === item.token.id;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					onClick: () => onSelect(token),
					className: cn("grid cursor-pointer items-center gap-3 px-3 py-2.5 transition-colors duration-[var(--motion-quick)]", "grid-cols-[minmax(0,1fr)_auto] lg:grid-cols-[minmax(0,1.2fr)_0.7fr_0.7fr_0.7fr_auto]", selected ? "bg-accent/10 shadow-[inset_2px_0_0_0_var(--color-accent)]" : "hover:bg-surface-2/80"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex min-w-0 items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex size-8 shrink-0 items-center justify-center text-accent",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, { className: "size-3.5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate text-sm font-semibold text-fg",
											children: item.token.symbol
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded bg-surface-2 px-1 py-px text-2xs text-muted",
											children: chain.short
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: cn("rounded px-1 py-px text-2xs font-semibold", item.mode === "scalping" ? "bg-scalp/15 text-scalp" : "bg-swing/15 text-swing"),
											children: item.mode === "scalping" ? "Scalp" : "Swing"
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "block truncate text-2xs text-muted",
									children: [item.token.smcSignal, live ? "" : " · off tape"]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-right",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "font-mono text-sm font-semibold tabular-nums text-fg",
									children: ["$", formatPrice(price)]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex justify-end",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChangeCell, {
										value: pnl,
										emphasize: true
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "hidden text-2xs text-subtle lg:block",
									children: ["from $", formatPrice(item.entry)]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hidden text-right lg:block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "font-mono text-2xs tabular-nums text-up",
								children: [
									formatPrice(item.tp1),
									" / ",
									formatPrice(item.tp2)
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-mono text-2xs tabular-nums text-down",
								children: formatPrice(item.sl)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hidden text-right lg:block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-mono text-sm tabular-nums text-fg",
								children: formatAge(item.takenAt)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-2xs text-subtle",
								children: "ago"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-end gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("rounded-md px-2 py-1 text-2xs font-semibold", meta.className),
								children: meta.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": "Drop taken signal",
								onClick: (e) => {
									e.stopPropagation();
									onDrop(item.key);
								},
								className: "flex size-8 items-center justify-center rounded-md text-subtle hover:text-down",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookmarkX, { className: "size-3.5" })
							})]
						})
					]
				}, item.key);
			})
		})]
	});
}
function backPrice(price, changePct) {
	const denom = 1 + changePct / 100;
	if (!Number.isFinite(denom) || denom <= .02) return price * .5;
	return price / denom;
}
function hash32(s) {
	let h = 2166136261;
	for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
	return h >>> 0;
}
function rng(seed) {
	let a = seed || 1;
	return () => {
		a = Math.imul(a ^ a >>> 16, 2246822507);
		a = Math.imul(a ^ a >>> 13, 3266489917);
		return ((a ^= a >>> 16) >>> 0) / 4294967296;
	};
}
function smoothstep(t) {
	const x = Math.min(1, Math.max(0, t));
	return x * x * (3 - 2 * x);
}
function sparklinePrices(token) {
	return [
		backPrice(token.price, token.priceChange24h),
		backPrice(token.price, token.priceChange6h),
		backPrice(token.price, token.priceChange1h),
		backPrice(token.price, token.priceChange5m),
		token.price
	].map((n) => Number.isFinite(n) && n > 0 ? n : token.price);
}
function anchors(token, mode) {
	const nowVol = Math.max(token.volume5m, token.volume1h / 12, token.volume24h / 288);
	const h1Vol = Math.max(token.volume1h / 12, nowVol * .6);
	const h6Vol = Math.max(token.volume24h / 96, h1Vol * .7);
	const dVol = Math.max(token.volume24h / 288, h6Vol * .5);
	const all = [
		{
			minAgo: 1440,
			price: backPrice(token.price, token.priceChange24h),
			volume: dVol
		},
		{
			minAgo: 360,
			price: backPrice(token.price, token.priceChange6h),
			volume: h6Vol
		},
		{
			minAgo: 60,
			price: backPrice(token.price, token.priceChange1h),
			volume: h1Vol
		},
		{
			minAgo: 5,
			price: backPrice(token.price, token.priceChange5m),
			volume: nowVol
		},
		{
			minAgo: 0,
			price: token.price,
			volume: nowVol
		}
	];
	const maxAgo = mode === "scalping" ? 120 : 1440;
	const clipped = all.filter((a) => a.minAgo <= maxAgo);
	if (clipped[0]?.minAgo !== maxAgo) {
		const hi = all.find((a) => a.minAgo >= maxAgo) ?? all[0];
		const lo = all.find((a) => a.minAgo < maxAgo) ?? all[all.length - 1];
		const span = hi.minAgo - lo.minAgo || 1;
		const t = (maxAgo - lo.minAgo) / span;
		clipped.unshift({
			minAgo: maxAgo,
			price: lo.price + (hi.price - lo.price) * t,
			volume: lo.volume + (hi.volume - lo.volume) * t
		});
	}
	return clipped;
}
function buildChartSeries(token, mode) {
	const pts = anchors(token, mode);
	const n = mode === "scalping" ? 48 : 56;
	const maxAgo = pts[0]?.minAgo ?? 60;
	const now = Date.now();
	const rand = rng(hash32(token.id + String(Math.round(token.price * 1e8))));
	const amp = token.price * .0035 * Math.min(2.4, Math.max(.6, token.volumeRatio));
	const out = [];
	for (let i = 0; i < n; i++) {
		const minAgo = maxAgo * (1 - i / (n - 1));
		let hi = pts[0];
		let lo = pts[pts.length - 1];
		for (let k = 0; k < pts.length - 1; k++) if (minAgo <= pts[k].minAgo && minAgo >= pts[k + 1].minAgo) {
			hi = pts[k];
			lo = pts[k + 1];
			break;
		}
		const span = hi.minAgo - lo.minAgo || 1;
		const u = smoothstep((hi.minAgo - minAgo) / span);
		let price = hi.price + (lo.price - hi.price) * u;
		const edge = Math.min(minAgo, maxAgo - minAgo) / (maxAgo * .12);
		const fade = Math.min(1, Math.max(0, edge));
		const wiggle = (rand() - .5) * 2 * amp * fade;
		price = Math.max(price * .4, price + wiggle);
		const volume = Math.max(0, hi.volume + (lo.volume - hi.volume) * u) * (.65 + rand() * .7);
		out.push({
			t: now - minAgo * 6e4,
			price,
			volume
		});
	}
	if (out.length) out[out.length - 1].price = token.price;
	return out;
}
function PriceChart({ token, mode }) {
	const series = (0, import_react.useMemo)(() => buildChartSeries(token, mode), [token, mode]);
	const plan = (0, import_react.useMemo)(() => tradePlan(token.marketCap, mode), [token.marketCap, mode]);
	const [hover, setHover] = (0, import_react.useState)(null);
	const toPx = (v) => planToPrice(v, token.price, token.marketCap);
	const entryLow = toPx(plan.entryLow);
	const entryHigh = toPx(plan.entryHigh);
	const levels = [
		{
			key: "tp2",
			label: "TP2",
			price: toPx(plan.tp2),
			tone: "up"
		},
		{
			key: "tp1",
			label: "TP1",
			price: toPx(plan.tp1),
			tone: "up"
		},
		{
			key: "sl",
			label: "SL",
			price: toPx(plan.sl),
			tone: "down"
		}
	];
	const W = 640;
	const H = 188;
	const pad = {
		l: 8,
		r: 78,
		t: 14,
		b: 28
	};
	const innerW = W - pad.l - pad.r;
	const innerH = H - pad.t - pad.b;
	const prices = series.map((p) => p.price);
	const extra = [
		...levels.map((l) => l.price),
		entryLow,
		entryHigh,
		token.price
	];
	const min = Math.min(...prices, ...extra) * .997;
	const span = Math.max(...prices, ...extra) * 1.003 - min || 1;
	const xAt = (i) => pad.l + i / Math.max(series.length - 1, 1) * innerW;
	const yAt = (price) => pad.t + (1 - (price - min) / span) * innerH;
	const placed = [...levels].map((lvl) => ({
		...lvl,
		y: yAt(lvl.price)
	})).sort((a, b) => a.y - b.y);
	for (let i = 1; i < placed.length; i++) if (placed[i].y - placed[i - 1].y < 13) placed[i].y = placed[i - 1].y + 13;
	const line = series.map((p, i) => `${i === 0 ? "M" : "L"}${xAt(i).toFixed(1)} ${yAt(p.price).toFixed(1)}`).join(" ");
	const area = `${line} L${xAt(series.length - 1).toFixed(1)} ${pad.t + innerH} L${xAt(0).toFixed(1)} ${pad.t + innerH} Z`;
	const up = (series.at(-1)?.price ?? 0) >= (series[0]?.price ?? 0);
	const hi = hover != null ? series[hover] : series.at(-1);
	const maxVol = Math.max(...series.map((p) => p.volume), 1);
	const yEntryTop = Math.min(yAt(entryHigh), yAt(entryLow));
	const yEntryH = Math.abs(yAt(entryHigh) - yAt(entryLow));
	const onMove = (ev) => {
		const box = ev.currentTarget.getBoundingClientRect();
		const x = (ev.clientX - box.left) / box.width * W;
		const i = Math.round((x - pad.l) / innerW * (series.length - 1));
		setHover(Math.min(series.length - 1, Math.max(0, i)));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border-b border-border px-3 pb-3 pt-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-1.5 flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-2xs font-semibold uppercase tracking-wider text-subtle",
					children: mode === "scalping" ? "Print path · last 2h" : "Print path · last 24h"
				}), hi ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "font-mono text-xs font-semibold tabular-nums text-fg",
					children: [
						"$",
						formatPrice(hi.price),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("ml-1.5 text-2xs", up ? "text-up" : "text-down"),
							children: formatPct((hi.price - (series[0]?.price ?? hi.price)) / (series[0]?.price || 1) * 100, 2)
						})
					]
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				viewBox: `0 0 ${W} ${H}`,
				className: "h-44 w-full",
				onPointerMove: onMove,
				onPointerLeave: () => setHover(null),
				role: "img",
				"aria-label": "Price path with take-profit and stop levels",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: pad.l,
						y: yEntryTop,
						width: innerW,
						height: Math.max(2, yEntryH),
						fill: "color-mix(in oklab, var(--color-muted) 14%, transparent)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: area,
						fill: up ? "color-mix(in oklab, var(--color-up) 16%, transparent)" : "color-mix(in oklab, var(--color-down) 16%, transparent)"
					}),
					series.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: xAt(i) - innerW / series.length / 3,
						y: pad.t + innerH - Math.max(2, p.volume / maxVol * 22),
						width: Math.max(1.5, innerW / series.length / 2.2),
						height: Math.max(2, p.volume / maxVol * 22),
						fill: "color-mix(in oklab, var(--color-fg) 12%, transparent)"
					}, p.t)),
					placed.map((lvl) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: pad.l,
						x2: W - pad.r + 4,
						y1: yAt(lvl.price),
						y2: yAt(lvl.price),
						stroke: lvl.tone === "up" ? "var(--color-up)" : "var(--color-down)",
						strokeWidth: "1",
						strokeDasharray: "4 3",
						opacity: "0.75"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
						x: W - pad.r + 8,
						y: lvl.y + 3,
						fill: lvl.tone === "up" ? "var(--color-up)" : "var(--color-down)",
						fontSize: "10",
						fontFamily: "var(--font-mono)",
						children: [
							lvl.label,
							" ",
							formatPrice(lvl.price)
						]
					})] }, lvl.key)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: line,
						fill: "none",
						stroke: up ? "var(--color-up)" : "var(--color-down)",
						strokeWidth: "1.8",
						strokeLinejoin: "round",
						strokeLinecap: "round"
					}),
					hover != null && hi ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: xAt(hover),
						x2: xAt(hover),
						y1: pad.t,
						y2: pad.t + innerH,
						stroke: "color-mix(in oklab, var(--color-fg) 28%, transparent)",
						strokeDasharray: "3 3"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: xAt(hover),
						cy: yAt(hi.price),
						r: "3.5",
						fill: up ? "var(--color-up)" : "var(--color-down)"
					})] }) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
						x: pad.l,
						y: 180,
						fill: "var(--color-subtle)",
						fontSize: "10",
						children: mode === "scalping" ? "2h ago" : "24h ago"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
						x: W - pad.r - 22,
						y: 180,
						fill: "var(--color-subtle)",
						fontSize: "10",
						children: "now"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-2xs text-subtle",
				children: "Gray band is the entry zone. Path from 5m / 1h / 6h / 24h prints — not tick candles."
			})
		]
	});
}
var useRisk = create()(persist((set) => ({
	account: 1e3,
	riskPct: 1,
	setAccount: (account) => set({ account }),
	setRiskPct: (riskPct) => set({ riskPct })
}), { name: "momentumflow-risk" }));
function RiskPanel({ token, mode }) {
	const account = useRisk((s) => s.account);
	const riskPct = useRisk((s) => s.riskPct);
	const setAccount = useRisk((s) => s.setAccount);
	const setRiskPct = useRisk((s) => s.setRiskPct);
	const math = (0, import_react.useMemo)(() => {
		const plan = tradePlan(token.marketCap, mode);
		const slPx = planToPrice(plan.sl, token.price, token.marketCap);
		const slPct = token.price > 0 ? Math.abs(token.price - slPx) / token.price : 0;
		const riskUsd = account * (Math.max(0, riskPct) / 100);
		const positionUsd = slPct > 0 ? riskUsd / slPct : 0;
		return {
			slPx,
			slPct,
			riskUsd,
			positionUsd,
			units: token.price > 0 ? positionUsd / token.price : 0
		};
	}, [
		account,
		riskPct,
		token.price,
		token.marketCap,
		mode
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mb-1 block text-2xs uppercase tracking-wider text-subtle",
						children: "Account (USD)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						min: 0,
						step: 50,
						value: Number.isFinite(account) ? account : 0,
						onChange: (e) => setAccount(Number(e.target.value) || 0),
						className: "h-9 font-mono text-xs"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mb-1 block text-2xs uppercase tracking-wider text-subtle",
						children: "Risk / trade"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: .1,
							max: 10,
							step: .25,
							value: Number.isFinite(riskPct) ? riskPct : 1,
							onChange: (e) => setRiskPct(Number(e.target.value) || 0),
							className: "h-9 pr-7 font-mono text-xs"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-2xs text-subtle",
							children: "%"
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-px overflow-hidden rounded-md bg-border ring-1 ring-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$1, {
						label: "At risk",
						value: formatUsd(math.riskUsd)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$1, {
						label: "Stop distance",
						value: `${(math.slPct * 100).toFixed(2)}%`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$1, {
						label: "Position",
						value: formatUsd(math.positionUsd)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$1, {
						label: "Size",
						value: `${math.units >= 1 ? math.units.toFixed(2) : formatPrice(math.units)} ${token.symbol}`
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-2xs leading-relaxed text-subtle",
				children: [
					"Size sized so a hit of SL at $",
					formatPrice(math.slPx),
					" loses ",
					riskPct,
					"% of the account. Not an order — check liquidity first."
				]
			})
		]
	});
}
function Stat$1({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-bg px-3 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-2xs uppercase tracking-wider text-subtle",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "truncate font-mono text-xs font-semibold tabular-nums text-fg",
			children: value
		})]
	});
}
var badgeVariants = cva("inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-2xs font-semibold tracking-wide", {
	variants: { tone: {
		neutral: "bg-surface-2 text-muted",
		up: "bg-up/15 text-up",
		down: "bg-down/15 text-down",
		accent: "bg-accent/15 text-accent",
		warn: "bg-warn/15 text-warn",
		scalp: "bg-scalp/15 text-scalp",
		swing: "bg-swing/15 text-swing"
	} },
	defaultVariants: { tone: "neutral" }
});
function Badge({ className, tone, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({ tone }), className),
		...props
	});
}
function Skeleton({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("animate-pulse rounded-md bg-surface-2", className),
		...props
	});
}
function useSecurity(token) {
	return useQuery({
		queryKey: ["security", token?.id],
		enabled: Boolean(token) && token?.source === "dex" && Boolean(token?.ca),
		initialData: token?.security,
		queryFn: async () => {
			if (!token) throw new Error("No token");
			if (token.security?.source === "goplus") return token.security;
			try {
				return await fetchTokenSecurity({ data: {
					chain: token.chain,
					address: token.ca
				} });
			} catch {
				const sells = token.buys24h + token.sells24h;
				const sellShare = sells > 0 ? Math.min(token.sells24h / sells * 100, 40) : 15;
				return estimatedSecurity(token.liquidity, sellShare);
			}
		},
		staleTime: 12e4
	});
}
var useWatchlist = create()(persist((set, get) => ({
	ids: [],
	toggle: (id) => set((state) => ({ ids: state.ids.includes(id) ? state.ids.filter((x) => x !== id) : [...state.ids, id] })),
	has: (id) => get().ids.includes(id)
}), { name: "momentumflow-watchlist" }));
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-bg px-3 py-2.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-2xs uppercase tracking-wider text-subtle",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "font-mono text-sm font-semibold tabular-nums text-fg",
			children: value
		})]
	});
}
function Section({ title, icon, tone = "accent", action, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border-b border-border px-4 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-2.5 flex items-center justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("flex items-center gap-1.5 text-2xs font-semibold uppercase tracking-wider", tone === "accent" && "text-accent", tone === "scalp" && "text-scalp", tone === "swing" && "text-swing"),
				children: [icon, title]
			}), action]
		}), children]
	});
}
function CheckRow({ ok, okLabel, badLabel, sub }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex items-start gap-2.5 rounded-md px-3 py-2 ring-1", ok ? "bg-up/10 ring-up/20" : "bg-down/10 ring-down/20"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full", ok ? "bg-up/20 text-up" : "bg-down/20 text-down"),
			children: ok ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-3" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0 flex-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("text-xs font-semibold", ok ? "text-up" : "text-down"),
				children: ok ? okLabel : badLabel
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-2xs text-muted",
				children: sub
			})]
		})]
	});
}
function PlanGrid({ plan, token, variant }) {
	const toPx = (v) => planToPrice(v, token.price, token.marketCap);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cn("rounded-md px-3 py-2 ring-1", variant === "scalp" ? "bg-scalp/10 ring-scalp/20 text-scalp" : "bg-swing/10 ring-swing/20 text-swing"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-0.5 text-2xs font-semibold uppercase tracking-wider",
							children: "Entry zone"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "font-mono text-xs font-bold tabular-nums text-fg",
							children: [
								"$",
								formatPrice(toPx(plan.entryLow)),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-subtle",
									children: " / "
								}),
								formatUsd(plan.entryLow)
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "font-mono text-2xs tabular-nums text-muted",
							children: [
								"to $",
								formatPrice(toPx(plan.entryHigh)),
								" / ",
								formatUsd(plan.entryHigh)
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-md bg-down/10 px-3 py-2 ring-1 ring-down/20",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-0.5 text-2xs font-semibold uppercase tracking-wider text-down",
							children: "Stop loss"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "font-mono text-xs font-bold tabular-nums text-fg",
							children: [
								"$",
								formatPrice(toPx(plan.sl)),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-subtle",
									children: " / "
								}),
								formatUsd(plan.sl)
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-2xs font-semibold text-down",
							children: formatPct((plan.sl - token.marketCap) / token.marketCap * 100)
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-md bg-up/10 px-3 py-2 ring-1 ring-up/20",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-0.5 flex items-center gap-1 text-2xs font-semibold uppercase tracking-wider text-up",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "size-3" }), " TP1"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "font-mono text-xs font-bold tabular-nums text-fg",
							children: [
								"$",
								formatPrice(toPx(plan.tp1)),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-subtle",
									children: " / "
								}),
								formatUsd(plan.tp1)
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-2xs font-semibold text-up",
							children: formatPct((plan.tp1 - token.marketCap) / token.marketCap * 100)
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-md bg-up/10 px-3 py-2 ring-1 ring-up/20",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-0.5 flex items-center gap-1 text-2xs font-semibold uppercase tracking-wider text-up",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "size-3" }), " TP2"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "font-mono text-xs font-bold tabular-nums text-fg",
							children: [
								"$",
								formatPrice(toPx(plan.tp2)),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-subtle",
									children: " / "
								}),
								formatUsd(plan.tp2)
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-2xs font-semibold text-up",
							children: formatPct((plan.tp2 - token.marketCap) / token.marketCap * 100)
						})
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between rounded-md bg-bg px-3 py-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-2xs text-muted",
					children: "R/R TP1"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-xs font-bold text-accent",
					children: riskReward(token.marketCap, plan.tp1, plan.sl)
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between rounded-md bg-bg px-3 py-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-2xs text-muted",
					children: "R/R TP2"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-xs font-bold text-accent",
					children: riskReward(token.marketCap, plan.tp2, plan.sl)
				})]
			})]
		})]
	});
}
function SecurityBlock({ report, loading, token }) {
	if (loading && !report) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-12 w-full" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-12 w-full" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-12 w-full" })
		]
	});
	if (!report) return null;
	const taxOk = report.taxBuy <= 3 && report.taxSell <= 3;
	const ownerOk = report.renouncedOwnership && !report.mintable && !report.freezeable;
	const lpOk = isLpSafe(token, report);
	const allOk = passesAllChecks(token, report);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [
			allOk ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex items-start gap-2.5 rounded-md bg-up/10 px-3 py-2 ring-1 ring-up/20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "mt-0.5 size-4 shrink-0 text-up" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs font-semibold text-up",
					children: "Passed all checks"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-2xs text-muted",
					children: "Honeypot, LP, ownership, and tax are clean"
				})] })]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex items-start gap-2.5 rounded-md bg-down/10 px-3 py-2 ring-1 ring-down/20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "mt-0.5 size-4 shrink-0 text-down" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs font-semibold text-down",
					children: "Failed security screen"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-2xs text-muted",
					children: "Does not meet every security requirement"
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckRow, {
				ok: !report.honeypot,
				okLabel: "No honeypot",
				badLabel: "Honeypot risk",
				sub: report.honeypot ? "Token may not be sellable" : "Sells appear possible"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckRow, {
				ok: lpOk,
				okLabel: report.lpLocked ? `LP locked · ${report.lpLockedPercent}%` : "LP deep / aged",
				badLabel: "LP not locked",
				sub: report.lpLocked ? "From GoPlus lock / burn data" : lpOk ? "Aged pool with deep liquidity" : report.source === "goplus" ? "New or thin pool — lock / burn required" : "Estimated from pool size"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckRow, {
				ok: ownerOk,
				okLabel: "Ownership / mint safe",
				badLabel: report.freezeable ? "Freeze authority active" : report.mintable ? "Mint authority active" : "Ownership not renounced",
				sub: report.freezeable ? "Freeze authority still enabled" : "Owner cannot freely mint"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckRow, {
				ok: taxOk,
				okLabel: `Buy/Sell tax · ${report.taxBuy.toFixed(1)}/${report.taxSell.toFixed(1)}%`,
				badLabel: `High tax · ${report.taxBuy.toFixed(1)}/${report.taxSell.toFixed(1)}%`,
				sub: taxOk ? "Taxes within a 3% band" : "Taxes exceed 3%"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex items-center justify-between rounded-md bg-bg px-3 py-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted",
					children: "Top 10 holders"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("font-mono text-xs font-bold tabular-nums", report.topHoldersPercent <= 0 ? "text-muted" : report.topHoldersPercent > 25 ? "text-warn" : "text-accent"),
					children: report.topHoldersPercent <= 0 ? "n/a" : `${report.topHoldersPercent.toFixed(1)}%`
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "pt-1 text-2xs text-subtle",
				children: report.source === "goplus" ? "Contract scan via GoPlus Labs." : report.notes[0] ?? "Estimated checks only."
			})
		]
	});
}
function DetailRow({ label, value, up }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("text-xs font-semibold", up ? "text-accent" : "text-fg/80"),
			children: value
		})]
	});
}
function copyPlan(token, mode) {
	const plan = tradePlan(token.marketCap, mode);
	const toPx = (v) => planToPrice(v, token.price, token.marketCap);
	const lines = [
		`MomentumFlow · ${token.symbol} · ${mode}`,
		`Chain  ${token.chain}`,
		`Price  $${formatPrice(token.price)}  Mcap ${formatUsd(token.marketCap)}`,
		`Signal ${token.smcSignal} · ${token.signalStrength}/100`,
		`Entry  $${formatPrice(toPx(plan.entryLow))} – $${formatPrice(toPx(plan.entryHigh))}`,
		`SL     $${formatPrice(toPx(plan.sl))}  (${formatPct((plan.sl - token.marketCap) / token.marketCap * 100)})`,
		`TP1    $${formatPrice(toPx(plan.tp1))}  (${formatPct((plan.tp1 - token.marketCap) / token.marketCap * 100)})  ${riskReward(token.marketCap, plan.tp1, plan.sl)}`,
		`TP2    $${formatPrice(toPx(plan.tp2))}  (${formatPct((plan.tp2 - token.marketCap) / token.marketCap * 100)})  ${riskReward(token.marketCap, plan.tp2, plan.sl)}`,
		`CA     ${token.ca}`,
		"Not financial advice."
	];
	return navigator.clipboard.writeText(lines.join("\n"));
}
function TokenDetail({ token, mode, onClose, onTaken }) {
	const chain = CHAIN_BY_ID[token.chain];
	const scalp = tradePlan(token.marketCap, "scalping");
	const swing = tradePlan(token.marketCap, "swing");
	const securityQuery = useSecurity(token.source === "dex" ? token : null);
	const fallback = estimatedSecurity(token.liquidity, token.buys24h + token.sells24h > 0 ? Math.min(token.sells24h / (token.buys24h + token.sells24h) * 100, 40) : 15);
	const report = token.source === "dex" ? securityQuery.data : fallback;
	const watched = useWatchlist((s) => s.ids.includes(token.id));
	const toggle = useWatchlist((s) => s.toggle);
	const take = useTaken((s) => s.take);
	const taken = useTaken((s) => s.has(token.id, mode));
	const [copied, setCopied] = (0, import_react.useState)(false);
	const dexUrl = token.source === "dex" ? dexScreenerPath(token.chain, token.pairAddress || token.ca) : `https://www.coingecko.com/en/coins/${token.ca}`;
	const buys = token.buys24h;
	const flow = buys + token.sells24h;
	const buyPct = flow > 0 ? buys / flow * 100 : 50;
	const activePlan = mode === "scalping" ? scalp : swing;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex max-h-[80vh] flex-col overflow-hidden rounded-xl border border-border bg-surface lg:max-h-[calc(100vh-8rem)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between border-b border-border px-4 py-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 items-center gap-2.5",
				children: [token.imageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: token.imageUrl,
					alt: "",
					className: "size-9 rounded-md object-cover ring-1 ring-border"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex size-9 items-center justify-center rounded-md bg-surface-2 text-2xs font-bold text-accent ring-1 ring-border",
					children: chain.short
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-bold text-fg",
								children: token.symbol
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								tone: token.priceChange24h >= 0 ? "up" : "down",
								children: formatPct(token.priceChange24h)
							}),
							token.signalAt ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								tone: Date.now() - token.signalAt < 3e5 ? "warn" : "neutral",
								children: formatAge(token.signalAt)
							}) : token.pairCreatedAt ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								tone: "neutral",
								children: formatAge(token.pairCreatedAt)
							}) : null
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-2xs text-muted",
						children: [
							token.name,
							" · ",
							chain.name
						]
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						"aria-label": "Copy plan",
						onClick: () => {
							take(token, mode);
							copyPlan(token, mode).then(() => {
								setCopied(true);
								onTaken?.();
								setTimeout(() => setCopied(false), 1400);
							});
						},
						className: copied ? "text-accent" : "",
						children: copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						"aria-label": "Watchlist",
						onClick: () => toggle(token.id),
						className: watched ? "text-warn" : "",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, {
							className: "size-4",
							fill: watched ? "currentColor" : "none"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						"aria-label": "Close",
						onClick: onClose,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 overflow-y-auto",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-3 gap-px bg-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Price",
							value: `$${formatPrice(token.price)}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Mcap",
							value: formatUsd(token.marketCap)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Liquidity",
							value: formatUsd(token.liquidity)
						})
					]
				}),
				flow > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-b border-border px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-1.5 flex justify-between text-2xs text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"Buy ",
							buyPct.toFixed(0),
							"%"
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"Sell ",
							(100 - buyPct).toFixed(0),
							"%"
						] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-1.5 overflow-hidden rounded-full bg-down/40",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full bg-up",
							style: { width: `${buyPct}%` }
						})
					})]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceChart, {
					token,
					mode
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					title: "Security checks",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-3.5" }),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SecurityBlock, {
						token,
						report,
						loading: securityQuery.isLoading
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					title: "Scalping plan · 5m / 15m",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "size-3.5" }),
					tone: "scalp",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlanGrid, {
						plan: scalp,
						token,
						variant: "scalp"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					title: "Swing plan · 1H / 4H",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "size-3.5" }),
					tone: "swing",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlanGrid, {
						plan: swing,
						token,
						variant: "swing"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-4 pb-2 pt-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: cn("flex items-center justify-center gap-1.5 rounded-md py-1.5 text-2xs font-medium ring-1", mode === "scalping" ? "bg-scalp/10 text-scalp ring-scalp/20" : "bg-swing/10 text-swing ring-swing/20"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 rounded-full bg-current" }),
								"Active mode: ",
								mode === "scalping" ? "Scalping 5m/15m" : "Swing 1H/4H",
								" · R/R",
								" ",
								riskReward(token.marketCap, activePlan.tp1, activePlan.sl)
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "mt-2 w-full",
							variant: taken ? "subtle" : "default",
							onClick: () => {
								take(token, mode);
								onTaken?.();
							},
							children: taken ? "Saved on Active tape" : "Take this signal"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1.5 text-center text-2xs text-subtle",
							children: "Pins entry / TP / SL so a new print does not wipe this trade."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					title: "Position size",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "size-3.5" }),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RiskPanel, {
						token,
						mode
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
					title: "Signal details",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "size-3.5" }),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
								label: "SMC signal",
								value: token.smcSignal
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-2xs leading-relaxed text-muted",
								children: smcNote(token.smcSignal)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
								label: "Signal strength",
								value: `${token.signalStrength}/100`,
								up: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
								label: "Price change 5m",
								value: formatPct(token.priceChange5m, 2),
								up: token.priceChange5m > 0
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
								label: "Price change 1h",
								value: formatPct(token.priceChange1h, 2),
								up: token.priceChange1h > 0
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
								label: "Price change 6h",
								value: formatPct(token.priceChange6h, 2),
								up: token.priceChange6h > 0
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
								label: "Price change 24h",
								value: formatPct(token.priceChange24h, 2),
								up: token.priceChange24h > 0
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
								label: "24h volume",
								value: formatUsd(token.volume24h)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
								label: "Vol ratio vs avg",
								value: `${token.volumeRatio.toFixed(1)}x`,
								up: true
							}),
							token.signalAt ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
								label: "Signal appeared",
								value: `${formatAge(token.signalAt)} ago`
							}) : null,
							token.pairCreatedAt ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
								label: "Pair age",
								value: formatAge(token.pairCreatedAt)
							}) : null
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-2xs leading-relaxed text-subtle",
						children: "SMC labels are momentum heuristics from price and volume, not order-book SMC. Not financial advice."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-2xs uppercase tracking-wider text-subtle",
							children: token.source === "dex" ? "Contract" : "Market id"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: dexUrl,
							target: "_blank",
							rel: "noopener noreferrer",
							className: "flex items-center gap-1 text-2xs text-muted hover:text-fg",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3" }), token.source === "dex" ? "DexScreener" : "CoinGecko"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 break-all font-mono text-2xs text-muted",
						children: token.ca
					})]
				})
			]
		})]
	});
}
var TONE = {
	"Bullish OB + FVG": "bg-accent/15 text-accent ring-accent/30",
	"Bullish OB": "bg-scalp/15 text-scalp ring-scalp/25",
	"Unfilled FVG": "bg-swing/15 text-swing ring-swing/25",
	Distribution: "bg-down/15 text-down ring-down/25"
};
var DOT = {
	"Bullish OB + FVG": "bg-accent",
	"Bullish OB": "bg-scalp",
	"Unfilled FVG": "bg-swing",
	Distribution: "bg-down"
};
function SignalBadge({ signal, strength }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-w-0 flex-col gap-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: cn("inline-flex w-fit items-center gap-1 rounded-md px-1.5 py-0.5 text-2xs font-semibold ring-1", TONE[signal]),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-1 rounded-full", DOT[signal]) }), signal]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-1.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-1 w-12 overflow-hidden rounded-full bg-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("h-full rounded-full", strength >= 90 ? "bg-accent" : strength >= 75 ? "bg-warn" : "bg-muted"),
					style: { width: `${strength}%` }
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-2xs tabular-nums text-subtle",
				children: strength
			})]
		})]
	});
}
function Sparkline({ values, className }) {
	if (values.length < 2) return null;
	const min = Math.min(...values);
	const span = Math.max(...values) - min || 1;
	const w = 72;
	const h = 28;
	const pad = 1.5;
	const coords = values.map((v, i) => {
		return [pad + i / (values.length - 1) * (w - pad * 2), pad + (1 - (v - min) / span) * (h - pad * 2)];
	});
	const d = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`).join(" ");
	const area = `${d} L${coords[coords.length - 1][0].toFixed(2)} ${h} L${coords[0][0].toFixed(2)} ${h} Z`;
	const up = values[values.length - 1] >= values[0];
	const stroke = up ? "var(--color-up)" : "var(--color-down)";
	const fill = up ? "color-mix(in oklab, var(--color-up) 22%, transparent)" : "color-mix(in oklab, var(--color-down) 22%, transparent)";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: `0 0 ${w} ${h}`,
		width: w,
		height: h,
		className: cn("shrink-0 overflow-visible", className),
		"aria-hidden": true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: area,
			fill
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d,
			fill: "none",
			stroke,
			strokeWidth: "1.4",
			strokeLinejoin: "round",
			strokeLinecap: "round"
		})]
	});
}
var GRID = "grid-cols-[minmax(0,1.4fr)_auto] lg:grid-cols-[minmax(0,1.35fr)_0.75fr_0.55fr_0.5fr_0.62fr_0.95fr_minmax(7.2rem,auto)]";
function PriceFlash({ price }) {
	const prev = (0, import_react.useRef)(price);
	const [dir, setDir] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (price !== prev.current) {
			setDir(price > prev.current ? "up" : "down");
			prev.current = price;
			const t = setTimeout(() => setDir(null), 700);
			return () => clearTimeout(t);
		}
	}, [price]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("font-mono text-sm font-semibold tabular-nums transition-colors duration-500", dir === "up" && "text-up", dir === "down" && "text-down", !dir && "text-fg"),
		children: ["$", formatPrice(price)]
	});
}
function TokenIdentity({ token, now }) {
	const chain = CHAIN_BY_ID[token.chain];
	const age = formatAge(token.signalAt, now);
	const fresh = signalFreshness(token.signalAt, now);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-w-0 items-center gap-2.5",
		children: [token.imageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: token.imageUrl,
			alt: "",
			className: "size-8 shrink-0 rounded-md bg-surface-2 object-cover ring-1 ring-border"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex size-8 shrink-0 items-center justify-center rounded-md bg-surface-2 text-2xs font-bold text-accent ring-1 ring-border",
			children: chain.short.slice(0, 3)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate text-sm font-semibold text-fg",
						children: token.symbol
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden rounded bg-surface-2 px-1 py-px text-2xs text-muted sm:inline",
						children: chain.short
					}),
					fresh !== "unknown" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("rounded px-1 py-px text-2xs font-semibold lg:hidden", fresh === "new" && "bg-warn/15 text-warn", fresh === "fresh" && "bg-accent/15 text-accent", fresh === "old" && "bg-surface-2 text-muted"),
						children: age
					}) : null
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block truncate text-2xs text-muted",
				children: token.name
			})]
		})]
	});
}
function TimeCell({ signalAt, now }) {
	const t = Math.max(now, signalAt ?? 0);
	const age = formatAge(signalAt, t);
	const fresh = signalFreshness(signalAt, t);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "text-right",
		title: "When this print first appeared on the screener tape",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("font-mono text-sm font-semibold tabular-nums", fresh === "new" && "text-warn", fresh === "fresh" && "text-fg", fresh === "old" && "text-muted", fresh === "unknown" && "text-subtle"),
			children: age
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-2xs text-subtle",
			children: signalAt ? formatClock(signalAt) : "—"
		})]
	});
}
function TokenRowView({ token, selected, mode, now, onSelect }) {
	const [copied, setCopied] = (0, import_react.useState)(false);
	const watched = useWatchlist((s) => s.ids.includes(token.id));
	const toggle = useWatchlist((s) => s.toggle);
	const spark = sparklinePrices(token);
	const change = mode === "scalping" ? token.priceChange1h : token.priceChange24h;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		onClick: () => onSelect(token),
		className: cn("grid cursor-pointer items-center gap-3 px-3 py-2.5 transition-colors duration-[var(--motion-quick)]", GRID, selected ? "bg-accent/10 shadow-[inset_2px_0_0_0_var(--color-accent)]" : "hover:bg-surface-2/80"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 items-center gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": watched ? "Remove from watchlist" : "Add to watchlist",
					onClick: (e) => {
						e.stopPropagation();
						toggle(token.id);
					},
					className: cn("flex size-8 shrink-0 items-center justify-center rounded-md text-subtle hover:text-warn", watched && "text-warn"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, {
						className: "size-3.5",
						fill: watched ? "currentColor" : "none"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TokenIdentity, {
					token,
					now
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-end gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkline, {
					values: spark,
					className: "lg:hidden"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-right",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceFlash, { price: token.price }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "lg:hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChangeCell, {
								value: change,
								emphasize: true
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "hidden text-2xs text-muted lg:block",
							children: formatUsd(token.marketCap)
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hidden text-right lg:block",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "font-mono text-sm font-semibold tabular-nums text-accent",
					children: [token.volumeRatio.toFixed(1), "x"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-2xs text-muted",
					children: [formatUsd(token.volume24h), " vol"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "hidden lg:block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimeCell, {
					signalAt: token.signalAt,
					now
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "hidden lg:flex lg:justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkline, { values: spark })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "hidden lg:block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignalBadge, {
					signal: token.smcSignal,
					strength: token.signalStrength
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "hidden items-center justify-end lg:flex",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: (e) => {
						e.stopPropagation();
						navigator.clipboard.writeText(token.ca).then(() => {
							setCopied(true);
							setTimeout(() => setCopied(false), 1400);
						});
					},
					className: cn("flex min-h-8 items-center gap-1 rounded-md px-2 text-2xs font-medium ring-1", copied ? "bg-accent/15 text-accent ring-accent/30" : "bg-surface text-muted ring-border hover:text-fg"),
					children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3" }), copied ? "Copied" : shortAddress(token.ca)]
				})
			})
		]
	});
}
function SortHead({ label, active, dir, align = "left", onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: cn("inline-flex items-center gap-0.5 text-2xs font-semibold uppercase tracking-wider", active ? "text-fg" : "text-subtle hover:text-muted", align === "right" && "w-full justify-end", align === "center" && "w-full justify-center"),
		children: [label, active ? dir === "desc" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { className: "size-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { className: "size-3" }) : null]
	});
}
function TokenTable({ tokens, selectedId, mode, loading, emptyHint, onSelect }) {
	const [sortKey, setSortKey] = (0, import_react.useState)("score");
	const [sortDir, setSortDir] = (0, import_react.useState)("desc");
	const [now, setNow] = (0, import_react.useState)(() => Date.now());
	(0, import_react.useEffect)(() => {
		setNow(Date.now());
		const t = setInterval(() => setNow(Date.now()), 15e3);
		return () => clearInterval(t);
	}, [tokens]);
	const toggleSort = (key) => {
		if (sortKey === key) setSortDir((d) => d === "desc" ? "asc" : "desc");
		else {
			setSortKey(key);
			setSortDir("desc");
		}
	};
	const rows = (0, import_react.useMemo)(() => {
		const list = [...tokens];
		const dir = sortDir === "asc" ? 1 : -1;
		list.sort((a, b) => {
			let av = 0;
			let bv = 0;
			switch (sortKey) {
				case "symbol": return dir * a.symbol.localeCompare(b.symbol);
				case "price":
					av = a.price;
					bv = b.price;
					break;
				case "vol":
					av = a.volumeRatio;
					bv = b.volumeRatio;
					break;
				case "time":
					av = a.signalAt ?? 0;
					bv = b.signalAt ?? 0;
					break;
				case "strength":
					av = a.signalStrength;
					bv = b.signalStrength;
					break;
				default:
					av = scoreForMode(a, mode);
					bv = scoreForMode(b, mode);
			}
			return dir * (av - bv);
		});
		return list;
	}, [
		tokens,
		sortKey,
		sortDir,
		mode
	]);
	if (loading && tokens.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-64 flex-col items-center justify-center gap-3 rounded-xl border border-border bg-surface",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-6 animate-spin text-accent" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Scanning live pairs + security…"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 w-full max-w-md space-y-2 px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-10 w-full" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-10 w-full" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-10 w-full" })
				]
			})
		]
	});
	if (tokens.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-64 flex-col items-center justify-center gap-3 rounded-xl border border-border bg-surface text-muted",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inbox, { className: "size-8" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "max-w-sm text-center text-sm",
			children: emptyHint ?? "No tokens match the current filters"
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-x-auto rounded-xl border border-border bg-surface",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "lg:min-w-[52rem]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("hidden gap-3 border-b border-border bg-bg/40 px-3 py-2 lg:grid", GRID),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "pl-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortHead, {
							label: "Token",
							active: sortKey === "symbol",
							dir: sortDir,
							onClick: () => toggleSort("symbol")
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortHead, {
						label: "Price / MC",
						active: sortKey === "price",
						dir: sortDir,
						align: "right",
						onClick: () => toggleSort("price")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortHead, {
						label: "Vol ratio",
						active: sortKey === "vol",
						dir: sortDir,
						align: "right",
						onClick: () => toggleSort("vol")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						title: "When this print first appeared on the screener tape",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortHead, {
							label: "Time",
							active: sortKey === "time",
							dir: sortDir,
							align: "right",
							onClick: () => toggleSort("time")
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-center text-2xs font-semibold uppercase tracking-wider text-subtle",
						children: "Path"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortHead, {
						label: "SMC",
						active: sortKey === "strength",
						dir: sortDir,
						onClick: () => toggleSort("strength")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-right text-2xs font-semibold uppercase tracking-wider text-subtle",
						children: "Contract"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "divide-y divide-border",
				children: rows.map((token) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TokenRowView, {
					token,
					selected: token.id === selectedId,
					mode,
					now,
					onSelect
				}, token.id))
			})]
		})
	});
}
function Rate({ label, stats, mode }) {
	const pct = stats.wr == null ? "—" : `${Math.round(stats.wr * 100)}%`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-2xs font-semibold uppercase tracking-wider text-subtle",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("font-mono text-sm font-semibold tabular-nums", stats.wr == null && "text-muted", stats.wr != null && stats.wr >= .5 && "text-up", stats.wr != null && stats.wr < .5 && "text-down"),
				children: pct
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-2xs tabular-nums text-muted",
				children: stats.n === 0 ? "waiting for closes" : `${stats.wins}W / ${stats.losses}L · n=${stats.n}`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-2xs text-subtle",
				children: [
					stats.open,
					" open · ",
					mode === "scalping" ? "scalp TP1" : "swing TP1"
				]
			})
		]
	});
}
function WinRateBar({ paper, taken, mode, onReset }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-4 flex flex-col gap-2 rounded-xl border border-border bg-surface px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start gap-2.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-accent/15 text-accent",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Percent, { className: "size-3.5" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 space-y-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rate, {
						label: "Screener paper",
						stats: paper,
						mode
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rate, {
						label: "Taken trades",
						stats: taken,
						mode
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-2xs leading-relaxed text-subtle",
						children: "Marks TP1 vs SL from the 30s live print — not candle wicks. Leave the tape running so prints can close. Reset starts a new sample."
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: onReset,
			className: "h-10 shrink-0 self-start rounded-md px-3 text-xs font-medium text-muted ring-1 ring-border hover:text-fg sm:self-center",
			children: "Reset paper"
		})]
	});
}
var MAX = 200;
var SCALP_TTL = 864e5;
var SWING_TTL = 6048e5;
function tallyPaper(items, mode) {
	const scoped = items.filter((i) => i.mode === mode);
	const wins = scoped.filter((i) => i.outcome === "win").length;
	const losses = scoped.filter((i) => i.outcome === "loss").length;
	const open = scoped.filter((i) => i.outcome === "open").length;
	const n = wins + losses;
	return {
		wins,
		losses,
		open,
		n,
		wr: n > 0 ? wins / n : null
	};
}
function resolvePx(p, px, now) {
	if (px <= p.sl) return {
		...p,
		lastPrice: px,
		outcome: "loss",
		exit: "sl",
		closedAt: now
	};
	if (px >= p.tp2) return {
		...p,
		lastPrice: px,
		outcome: "win",
		exit: "tp2",
		closedAt: now
	};
	if (px >= p.tp1) return {
		...p,
		lastPrice: px,
		outcome: "win",
		exit: "tp1",
		closedAt: now
	};
	return {
		...p,
		lastPrice: px
	};
}
var usePaper = create()(persist((set, get) => ({
	items: [],
	reset: () => set({ items: [] }),
	tick: (tape, live, mode) => {
		const now = Date.now();
		const liveMap = new Map(live.map((t) => [t.id, t]));
		let items = get().items;
		let changed = false;
		const next = [];
		for (const p of items) {
			if (p.outcome !== "open") {
				next.push(p);
				continue;
			}
			const ttl = p.mode === "scalping" ? SCALP_TTL : SWING_TTL;
			if (now - p.openedAt > ttl) {
				next.push({
					...p,
					outcome: "expired",
					closedAt: now
				});
				changed = true;
				continue;
			}
			const px = liveMap.get(p.tokenId)?.price;
			if (!(px && px > 0)) {
				next.push(p);
				continue;
			}
			const resolved = resolvePx(p, px, now);
			if (resolved.outcome !== p.outcome || resolved.lastPrice !== p.lastPrice || resolved.exit !== p.exit) changed = true;
			next.push(resolved);
		}
		const openOrClosed = new Set(next.filter((i) => i.mode === mode).map((i) => i.key));
		for (const t of tape) {
			if (!(t.price > 0) || t.marketCap <= 0) continue;
			const key = `${t.id}:${mode}`;
			if (openOrClosed.has(key)) continue;
			const plan = tradePlan(t.marketCap, mode);
			next.unshift({
				key,
				tokenId: t.id,
				symbol: t.symbol,
				chain: t.chain,
				mode,
				openedAt: now,
				entry: t.price,
				tp1: planToPrice(plan.tp1, t.price, t.marketCap),
				tp2: planToPrice(plan.tp2, t.price, t.marketCap),
				sl: planToPrice(plan.sl, t.price, t.marketCap),
				lastPrice: t.price,
				outcome: "open"
			});
			openOrClosed.add(key);
			changed = true;
		}
		let trimmed = next;
		if (trimmed.length > MAX) {
			const open = trimmed.filter((i) => i.outcome === "open");
			const rest = trimmed.filter((i) => i.outcome !== "open").slice(0, MAX - open.length);
			trimmed = [...open, ...rest];
			changed = true;
		}
		if (changed) set({ items: trimmed });
	}
}), { name: "momentumflow-paper" }));
var loadScreenerFeed = createServerFn({ method: "POST" }).validator((input) => {
	const data = input;
	return { chains: Array.isArray(data?.chains) ? data.chains : [] };
}).handler(createSsrRpc("f979675120384cba32bd930db749def153923a57eeebebe224e1de71faa6893b"));
var searchScreener = createServerFn({ method: "POST" }).validator((input) => {
	return { query: String(input?.query ?? "") };
}).handler(createSsrRpc("e8dccd2340f972bd5daa0ecc8546d3d3e31175d8cd7d6d3ec512560ec0d7392f"));
function useScreener(opts) {
	const { activeChains, preset, mode, query, secureOnly } = opts;
	const chainKey = [...activeChains].sort().join(",");
	const watchIds = useWatchlist((s) => s.ids);
	const screener = useQuery({
		queryKey: ["screener", chainKey],
		queryFn: () => loadScreenerFeed({ data: { chains: [...activeChains] } }),
		refetchInterval: 3e4,
		staleTime: 15e3
	});
	const remoteSearch = useQuery({
		queryKey: ["dex-search", query],
		queryFn: () => searchScreener({ data: { query } }),
		enabled: query.trim().length >= 3,
		staleTime: 2e4
	});
	const { tokens, matched, securePassed, scanned, live } = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		const base = screener.data?.tokens ?? [];
		const extra = remoteSearch.data ?? [];
		const map = /* @__PURE__ */ new Map();
		for (const t of [...base, ...extra]) {
			if (activeChains.size > 0 && !activeChains.has(t.chain)) continue;
			const prev = map.get(t.id);
			if (!prev || t.liquidity > prev.liquidity) map.set(t.id, t);
		}
		let rows = [...map.values()];
		const live = rows;
		if (preset === "watch") {
			const set = new Set(watchIds);
			rows = rows.filter((t) => set.has(t.id));
		} else rows = rows.filter((t) => matchesPreset(t, preset));
		if (q) rows = rows.filter((t) => t.symbol.toLowerCase().includes(q) || t.name.toLowerCase().includes(q) || t.ca.toLowerCase().includes(q));
		rows.sort((a, b) => scoreForMode(b, mode) - scoreForMode(a, mode));
		const passed = rows.filter((t) => t.secure);
		const scannedCount = rows.filter((t) => t.security?.source === "goplus").length;
		return {
			matched: rows.length,
			securePassed: passed.length,
			scanned: scannedCount,
			tokens: secureOnly && preset !== "active" && preset !== "watch" ? passed : rows,
			live
		};
	}, [
		screener.data,
		remoteSearch.data,
		activeChains,
		preset,
		watchIds,
		query,
		mode,
		secureOnly
	]);
	return {
		tokens,
		live,
		matched,
		securePassed,
		scanned,
		source: screener.data?.source ?? null,
		loading: screener.isLoading,
		refreshing: screener.isFetching,
		error: screener.error instanceof Error ? screener.error.message : null,
		fetchedAt: screener.dataUpdatedAt || null,
		refresh: () => screener.refetch()
	};
}
var STALE_MS = 216e5;
var memoryStorage = {
	getItem: () => null,
	setItem: () => void 0,
	removeItem: () => void 0,
	clear: () => void 0,
	key: () => null,
	length: 0
};
var useSignalTimes = create()(persist((set, get) => ({
	stamps: {},
	touch: (ids) => {
		const now = Date.now();
		const live = new Set(ids);
		const prev = get().stamps;
		const next = {};
		let changed = false;
		for (const id of ids) {
			const s = prev[id];
			if (!s || now - s.last > STALE_MS) {
				next[id] = {
					first: now,
					last: now
				};
				changed = true;
			} else {
				next[id] = {
					first: s.first,
					last: now
				};
				if (s.last !== now) changed = true;
			}
		}
		for (const [id, s] of Object.entries(prev)) {
			if (live.has(id)) continue;
			if (now - s.last > STALE_MS) {
				changed = true;
				continue;
			}
			next[id] = s;
		}
		if (changed) set({ stamps: next });
	}
}), {
	name: "momentumflow-signal-times",
	storage: createJSONStorage(() => typeof window === "undefined" ? memoryStorage : sessionStorage)
}));
function Home() {
	const [activeChains, setActiveChains] = (0, import_react.useState)(() => new Set(CHAINS.map((c) => c.id)));
	const [mode, setMode] = (0, import_react.useState)("scalping");
	const [preset, setPreset] = (0, import_react.useState)("momentum");
	const [query, setQuery] = (0, import_react.useState)("");
	const [secureOnly, setSecureOnly] = (0, import_react.useState)(true);
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [sheetOpen, setSheetOpen] = (0, import_react.useState)(false);
	const userCleared = (0, import_react.useRef)(false);
	const watchCount = useWatchlist((s) => s.ids.length);
	const takenItems = useTaken((s) => s.items);
	const dropTaken = useTaken((s) => s.drop);
	const paperItems = usePaper((s) => s.items);
	const paperTick = usePaper((s) => s.tick);
	const paperReset = usePaper((s) => s.reset);
	const stamps = useSignalTimes((s) => s.stamps);
	const touchSignals = useSignalTimes((s) => s.touch);
	const { tokens, live, matched, securePassed, scanned, source, loading, refreshing, error, fetchedAt, refresh } = useScreener({
		activeChains,
		preset,
		mode,
		query,
		secureOnly
	});
	const liveById = (0, import_react.useMemo)(() => new Map(live.map((t) => [t.id, t])), [live]);
	(0, import_react.useEffect)(() => {
		if (preset === "active" || tokens.length === 0) return;
		touchSignals(tokens.map((t) => t.id));
	}, [
		tokens,
		preset,
		touchSignals
	]);
	(0, import_react.useEffect)(() => {
		paperTick(preset === "active" || preset === "watch" ? [] : tokens, live, mode);
	}, [
		tokens,
		live,
		mode,
		preset,
		paperTick
	]);
	const stamp = (token) => ({
		...token,
		signalAt: stamps[token.id]?.first ?? token.signalAt
	});
	const takenRows = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		return takenItems.filter((item) => {
			if (activeChains.size > 0 && !activeChains.has(item.token.chain)) return false;
			if (!q) return true;
			return item.token.symbol.toLowerCase().includes(q) || item.token.name.toLowerCase().includes(q) || item.token.ca.toLowerCase().includes(q);
		});
	}, [
		takenItems,
		activeChains,
		query
	]);
	const displayTokens = (0, import_react.useMemo)(() => {
		if (preset !== "active") return tokens.map(stamp);
		return takenRows.map((item) => {
			const liveToken = liveById.get(item.token.id);
			const row = liveToken ? {
				...item.token,
				...liveToken,
				smcSignal: item.token.smcSignal,
				signalStrength: item.token.signalStrength
			} : item.token;
			return stamp(row);
		});
	}, [
		preset,
		tokens,
		takenRows,
		liveById,
		stamps
	]);
	(0, import_react.useEffect)(() => {
		if (userCleared.current) return;
		setSelected((prev) => {
			if (displayTokens.length === 0) return prev;
			if (prev) {
				const found = displayTokens.find((t) => t.id === prev.id);
				if (found) return found;
			}
			return displayTokens[0];
		});
	}, [displayTokens]);
	const selectedLive = (0, import_react.useMemo)(() => {
		if (!selected) return null;
		const found = displayTokens.find((t) => t.id === selected.id);
		if (found) return found;
		if (loading && displayTokens.length === 0) return selected;
		return null;
	}, [
		selected,
		displayTokens,
		loading
	]);
	const breadth = (0, import_react.useMemo)(() => {
		const chg = (t) => mode === "scalping" ? t.priceChange1h : t.priceChange24h;
		const up = displayTokens.filter((t) => chg(t) > 0).length;
		const down = displayTokens.filter((t) => chg(t) < 0).length;
		const sorted = displayTokens.map(chg).sort((a, b) => a - b);
		return {
			up,
			down,
			median: sorted.length ? sorted[Math.floor(sorted.length / 2)] : 0
		};
	}, [displayTokens, mode]);
	const paperStats = (0, import_react.useMemo)(() => tallyPaper(paperItems, mode), [paperItems, mode]);
	const takenStats = (0, import_react.useMemo)(() => {
		let wins = 0;
		let losses = 0;
		let open = 0;
		for (const item of takenItems) {
			if (item.mode !== mode) continue;
			const status = takenStatus(liveById.get(item.token.id)?.price ?? item.token.price, item);
			if (status === "tp1" || status === "tp2") wins += 1;
			else if (status === "sl") losses += 1;
			else open += 1;
		}
		const n = wins + losses;
		return {
			wins,
			losses,
			open,
			n,
			wr: n > 0 ? wins / n : null
		};
	}, [
		takenItems,
		liveById,
		mode
	]);
	const toggleChain = (0, import_react.useCallback)((id) => {
		setActiveChains((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});
	}, []);
	const selectAll = (0, import_react.useCallback)(() => {
		setActiveChains((prev) => prev.size === CHAINS.length ? /* @__PURE__ */ new Set() : new Set(CHAINS.map((c) => c.id)));
	}, []);
	const onSelect = (0, import_react.useCallback)((token) => {
		userCleared.current = false;
		setSelected(token);
		setSheetOpen(true);
	}, []);
	const onClose = (0, import_react.useCallback)(() => {
		setSheetOpen(false);
		userCleared.current = true;
		setSelected(null);
	}, []);
	const onTaken = (0, import_react.useCallback)(() => {
		setPreset("active");
	}, []);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			const target = e.target;
			if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return;
			if (displayTokens.length === 0) return;
			const idx = selectedLive ? displayTokens.findIndex((t) => t.id === selectedLive.id) : -1;
			if (e.key === "j" || e.key === "ArrowDown") {
				e.preventDefault();
				const next = displayTokens[Math.min(displayTokens.length - 1, Math.max(0, idx) + 1)] ?? displayTokens[0];
				userCleared.current = false;
				setSelected(next);
			} else if (e.key === "k" || e.key === "ArrowUp") {
				e.preventDefault();
				const next = displayTokens[Math.max(0, (idx < 0 ? 0 : idx) - 1)] ?? displayTokens[0];
				userCleared.current = false;
				setSelected(next);
			} else if (e.key === "Escape") setSheetOpen(false);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [displayTokens, selectedLive]);
	const emptyHint = preset === "watch" ? "Star tokens in the list to build a watchlist" : preset === "active" ? "Take a signal from the plan panel to keep it while you wait for TP" : secureOnly ? scanned > 0 ? `None of ${matched} matches passed every security check. Turn off Pass all checks to see the raw list.` : matched > 0 ? "Security scan returned no GoPlus results. Turn off Pass all checks to see raw pairs." : "No tokens match the current filters" : "No tokens match the current filters";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScreenerHeader, {
				mode,
				onModeChange: setMode,
				activeChains,
				onToggleChain: toggleChain,
				onSelectAll: selectAll,
				resultCount: displayTokens.length
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-screen-2xl px-4 py-4 lg:px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScreenerToolbar, {
						query,
						onQuery: setQuery,
						preset,
						onPreset: setPreset,
						source,
						fetchedAt,
						refreshing,
						onRefresh: () => void refresh(),
						watchCount,
						takenCount: takenItems.length,
						breadth,
						secureOnly,
						onSecureOnly: setSecureOnly,
						securePassed,
						scanned
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WinRateBar, {
						paper: paperStats,
						taken: takenStats,
						mode,
						onReset: paperReset
					}),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4 flex items-center gap-2 rounded-lg border border-down/20 bg-down/10 px-3 py-2 text-xs text-down",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-4 shrink-0" }), "Couldn’t load live pairs. Retry in a moment."]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-4 lg:flex-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "min-w-0 lg:w-[63%]",
							children: preset === "active" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TakenList, {
								items: takenRows,
								liveById,
								selectedId: selectedLive?.id ?? null,
								onSelect,
								onDrop: dropTaken
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TokenTable, {
								tokens: displayTokens,
								selectedId: selectedLive?.id ?? null,
								mode,
								loading,
								emptyHint,
								onSelect
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "hidden lg:block lg:w-[37%]",
							children: selectedLive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "lg:sticky lg:top-28",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TokenDetail, {
									token: selectedLive,
									mode,
									onClose,
									onTaken
								})
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex min-h-72 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-surface p-6 text-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "size-8 text-subtle" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium text-fg",
									children: "Select a token to analyze"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted",
									children: "Chart, security scan, SMC signal, and auto entry / TP / SL"
								})] })]
							})
						})]
					})
				]
			}),
			selectedLive && sheetOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-0 z-50 flex items-end lg:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "absolute inset-0 bg-bg/70",
					"aria-label": "Close details",
					onClick: () => setSheetOpen(false)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative w-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TokenDetail, {
						token: selectedLive,
						mode,
						onClose: () => setSheetOpen(false),
						onTaken
					})
				})]
			}) : null
		]
	});
}
//#endregion
export { Home as component };
