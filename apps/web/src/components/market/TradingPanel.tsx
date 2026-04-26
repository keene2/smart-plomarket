"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import type { Event, Market } from "@/types/market";
import { ChevronDown, Minus, Plus } from "lucide-react";

const categoryEmoji: Record<string, string> = {
  politics: "🏛",
  crypto: "₿",
  sports: "🏀",
  culture: "🎬",
  science: "🔬",
  other: "📊",
};

type OrderType = "market" | "limit";
type Side = "buy" | "sell";
type Outcome = "up" | "down";
type BtnStyle = "ghost" | "solid" | "outline";

const btnStyleLabels: Record<BtnStyle, string> = {
  ghost: "淡底微边框",
  solid: "纯色填充",
  outline: "线框",
};

function AnimatedNumber({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const [display, setDisplay] = useState(value);
  const [animate, setAnimate] = useState(false);
  const prevValue = useRef(value);

  useEffect(() => {
    if (prevValue.current !== value) {
      setAnimate(true);
      const t = setTimeout(() => {
        setDisplay(value);
        setAnimate(false);
      }, 80);
      prevValue.current = value;
      return () => clearTimeout(t);
    }
  }, [value]);

  return (
    <span
      className={cn(
        "inline-block transition-all duration-150",
        animate && "scale-105 opacity-60",
        className
      )}
    >
      {animate ? value : display}
    </span>
  );
}

export function TradingPanel({
  event,
  market,
}: {
  event: Event;
  market: Market;
}) {
  const [outcome, setOutcome] = useState<Outcome>("up");
  const [side, setSide] = useState<Side>("buy");
  const [orderType, setOrderType] = useState<OrderType>("market");
  const [amount, setAmount] = useState("");
  const [shares, setShares] = useState("");
  const [limitPrice, setLimitPrice] = useState(50);
  const [submitting, setSubmitting] = useState(false);
  const [orderTypeOpen, setOrderTypeOpen] = useState(false);
  const [btnStyle, setBtnStyle] = useState<BtnStyle>("ghost");
  const [btnStyleOpen, setBtnStyleOpen] = useState(false);
  const [inputFlash, setInputFlash] = useState(false);
  const amountRef = useRef<HTMLInputElement>(null);
  const sharesRef = useRef<HTMLInputElement>(null);

  const yes = market.outcomes.find((o) => o.label.toLowerCase() === "yes");
  const no = market.outcomes.find((o) => o.label.toLowerCase() === "no");

  const upPrice = yes?.price ?? 0.5;
  const downPrice = no?.price ?? 0.5;
  const activePrice = outcome === "up" ? upPrice : downPrice;

  // Buy mode: input is dollar amount
  // Sell mode: input is shares count
  const isBuy = side === "buy";
  const amountNum = parseFloat(amount) || 0;
  const sharesNum = parseFloat(shares) || 0;

  const MIN_AMOUNT = 5;
  const hasAmountInput = amount !== "" && amount !== "0";
  const hasSharesInput = shares !== "" && shares !== "0";

  // Validation
  const belowMin = isBuy && hasAmountInput && amountNum > 0 && amountNum < MIN_AMOUNT;
  const isValid = isBuy ? amountNum >= MIN_AMOUNT : sharesNum > 0;

  // Computed values
  const effectivePrice = orderType === "limit" ? limitPrice / 100 : activePrice;
  const computedShares = isBuy && amountNum > 0 ? amountNum / effectivePrice : sharesNum;
  const computedTotal = !isBuy && sharesNum > 0 ? sharesNum * effectivePrice : amountNum;
  const payout = computedShares;

  const addAmount = useCallback((v: number) => {
    if (isBuy) {
      setAmount((prev) => String(Math.max(0, (parseFloat(prev) || 0) + v)));
    } else {
      setShares((prev) => String(Math.max(0, (parseFloat(prev) || 0) + v)));
    }
    setInputFlash(true);
    setTimeout(() => setInputFlash(false), 150);
  }, [isBuy]);

  const handleSubmit = useCallback(() => {
    if (!isValid) return;
    setSubmitting(true);
    setTimeout(() => setSubmitting(false), 1200);
  }, [isValid]);

  const emoji = categoryEmoji[event.category] ?? "📊";

  // For multi-market: use the market question (e.g. "没有变化"); for binary: use Yes/No label
  const yesOutcome = market.outcomes.find((o) => o.label.toLowerCase() !== "no");
  const marketName = yesOutcome?.label ?? market.question;
  const outcomeLabel = outcome === "up" ? marketName : (no?.label ?? "No");

  // Submit button text
  const submitText = isBuy ? "交易" : `卖出 ${outcomeLabel}`;

  // Submit button color: buy uses yes/no based on outcome, sell uses blue
  // --- Style variants ---
  const yesNoSelected = (color: "yes" | "no") => {
    const styles: Record<BtnStyle, string> = {
      ghost: `border border-${color} bg-${color}/10 text-${color} hover:bg-${color}/15 active:scale-[0.97] active:bg-${color}/20`,
      solid: `bg-${color} text-white hover:bg-${color}/90 active:scale-[0.97] active:bg-${color}/80`,
      outline: `border-2 border-${color} bg-transparent text-${color} hover:bg-${color}/5 active:scale-[0.97] active:bg-${color}/10`,
    };
    return styles[btnStyle];
  };

  const yesNoUnselected = {
    ghost: "border border-foreground/15 bg-transparent text-muted-foreground hover:border-foreground/20 hover:bg-foreground/[0.04] hover:text-foreground active:scale-[0.97]",
    solid: "bg-secondary text-muted-foreground hover:bg-secondary/70 hover:text-foreground active:scale-[0.97] active:bg-secondary/90",
    outline: "border-2 border-border bg-transparent text-muted-foreground hover:border-foreground/30 hover:text-foreground active:scale-[0.97]",
  }[btnStyle];

  const quickBtnClass = {
    ghost: [
      "flex-1 rounded-xl border border-foreground/15 bg-transparent px-2 py-2 text-sm font-medium text-muted-foreground",
      "transition-all duration-200 ease-out",
      "hover:border-foreground/20 hover:bg-foreground/[0.04] hover:text-foreground",
      "active:scale-[0.95] active:bg-foreground/[0.08]",
    ],
    solid: [
      "flex-1 rounded-lg bg-secondary px-2 py-2 text-sm font-medium text-muted-foreground",
      "transition-all duration-200 ease-out",
      "hover:bg-secondary/70 hover:text-foreground",
      "active:scale-[0.95] active:bg-secondary/90",
    ],
    outline: [
      "flex-1 rounded-lg border border-border bg-transparent px-2 py-2 text-sm font-medium text-muted-foreground",
      "transition-all duration-200 ease-out",
      "hover:border-foreground/30 hover:text-foreground",
      "active:scale-[0.95] active:bg-foreground/[0.03]",
    ],
  }[btnStyle];

  const submitBg = isBuy
    ? outcome === "up" ? "bg-yes" : "bg-no"
    : "bg-interactive";

  const submitClass = {
    ghost: cn(
      "w-full rounded-lg py-3.5 text-sm font-semibold",
      "border",
      isBuy
        ? outcome === "up"
          ? "border-yes bg-yes/10 text-yes hover:bg-yes/15 active:scale-[0.98] active:bg-yes/20"
          : "border-no bg-no/10 text-no hover:bg-no/15 active:scale-[0.98] active:bg-no/20"
        : "border-interactive bg-interactive/10 text-interactive hover:bg-interactive/15 active:scale-[0.98] active:bg-interactive/20",
    ),
    solid: cn(
      "w-full rounded-lg py-3.5 text-sm font-semibold text-white",
      "hover:brightness-110 active:scale-[0.98] active:brightness-95",
      submitBg,
    ),
    outline: cn(
      "w-full rounded-lg py-3.5 text-sm font-semibold border-2",
      isBuy
        ? outcome === "up"
          ? "border-yes text-yes hover:bg-yes/5 active:scale-[0.98] active:bg-yes/10"
          : "border-no text-no hover:bg-no/5 active:scale-[0.98] active:bg-no/10"
        : "border-interactive text-interactive hover:bg-interactive/5 active:scale-[0.98] active:bg-interactive/10",
    ),
  }[btnStyle];

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm transition-shadow duration-300 hover:shadow-md">
      {/* Style switcher (dev) */}
      <div className="relative flex items-center justify-between border-b border-dashed border-border/50 px-4 py-1.5">
        <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/50">Style Preview</span>
        <div className="relative">
          <button
            onClick={() => setBtnStyleOpen(!btnStyleOpen)}
            className="flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {btnStyleLabels[btnStyle]}
            <ChevronDown className={cn("h-3 w-3 transition-transform duration-200", btnStyleOpen && "rotate-180")} />
          </button>
          <div
            className={cn(
              "absolute right-0 top-full z-20 mt-1 w-28 rounded-lg border border-border bg-card py-1 shadow-lg",
              "transition-all duration-150",
              btnStyleOpen ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
            )}
          >
            {(["ghost", "solid", "outline"] as const).map((s) => (
              <button
                key={s}
                onClick={() => { setBtnStyle(s); setBtnStyleOpen(false); }}
                className={cn(
                  "w-full px-3 py-1.5 text-left text-[11px] transition-colors",
                  btnStyle === s ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                )}
              >
                {btnStyleLabels[s]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Market context header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg",
            event.category === "crypto" && "bg-orange-500 text-white",
            event.category === "sports" && "bg-red-500 text-white",
            event.category === "politics" && "bg-blue-500 text-white",
            !["crypto", "sports", "politics"].includes(event.category) &&
              "bg-muted text-muted-foreground"
          )}
        >
          {emoji}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm text-muted-foreground">
            {market.question}
          </p>
          <p className="text-sm">
            <span
              className={cn(
                "font-medium",
                isBuy
                  ? outcome === "up" ? "text-yes" : "text-no"
                  : "text-interactive"
              )}
            >
              {isBuy ? "Buy" : "Sell"} {outcome === "up" ? "Yes" : "No"}
            </span>
            <span className="text-muted-foreground"> · </span>
            <span className="text-foreground">{outcomeLabel}</span>
          </p>
        </div>
      </div>

      {/* Buy/Sell + Order type tabs */}
      <div className="flex items-end justify-between border-b border-border px-4">
        <div className="flex gap-4">
          {(["buy", "sell"] as const).map((s) => (
            <button
              key={s}
              onClick={() => {
                setSide(s);
                setAmount("");
                setShares("");
              }}
              className={cn(
                "relative py-3 text-sm font-medium transition-all duration-200 ease-out",
                "focus-visible:outline-none",
                side === s
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground active:text-foreground/70"
              )}
            >
              {s === "buy" ? "买入" : "卖出"}
              <span
                className={cn(
                  "absolute bottom-0 left-0 h-0.5 w-full origin-left bg-foreground transition-transform duration-250 ease-out",
                  side === s ? "scale-x-100" : "scale-x-0"
                )}
              />
            </button>
          ))}
        </div>
        {/* Order type dropdown */}
        <div className="relative mb-2">
          <button
            onClick={() => setOrderTypeOpen(!orderTypeOpen)}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground transition-all duration-200 ease-out hover:bg-accent hover:text-foreground active:bg-accent/80 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20"
          >
            {orderType === "market" ? "盘口" : "限价"}
            <ChevronDown
              className={cn(
                "h-3 w-3 transition-transform duration-200",
                orderTypeOpen && "rotate-180"
              )}
            />
          </button>
          {/* Dropdown menu */}
          <div
            className={cn(
              "absolute right-0 top-full z-10 mt-1 w-24 rounded-lg border border-border bg-card py-1 shadow-lg",
              "transition-all duration-150",
              orderTypeOpen
                ? "scale-100 opacity-100"
                : "pointer-events-none scale-95 opacity-0"
            )}
          >
            {(["market", "limit"] as const).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setOrderType(t);
                  setOrderTypeOpen(false);
                }}
                className={cn(
                  "w-full px-3 py-1.5 text-left text-xs transition-colors duration-100",
                  orderType === t
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                )}
              >
                {t === "market" ? "盘口" : "限价"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Up / Down (Yes / No) toggle */}
        <div className="mb-4 grid grid-cols-2 gap-2">
          <button
            onClick={() => setOutcome("up")}
            className={cn(
              "rounded-xl py-3 text-center text-sm font-semibold",
              "transition-all duration-200 ease-out",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yes/50 focus-visible:ring-offset-2 focus-visible:ring-offset-card",
              outcome === "up" ? yesNoSelected("yes") : yesNoUnselected
            )}
          >
            {yes?.label ?? "是"} {(upPrice * 100).toFixed(0)}¢
          </button>
          <button
            onClick={() => setOutcome("down")}
            className={cn(
              "rounded-xl py-3 text-center text-sm font-semibold",
              "transition-all duration-200 ease-out",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-no/50 focus-visible:ring-offset-2 focus-visible:ring-offset-card",
              outcome === "down" ? yesNoSelected("no") : yesNoUnselected
            )}
          >
            {no?.label ?? "否"} {(downPrice * 100).toFixed(0)}¢
          </button>
        </div>

        {/* Limit price control — only in limit mode */}
        <div
          className={cn(
            "grid transition-all duration-200 ease-out",
            orderType === "limit"
              ? "mb-4 grid-rows-[1fr] opacity-100"
              : "mb-0 grid-rows-[0fr] opacity-0"
          )}
        >
          <div className="overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-foreground">限价</span>
              <div className="flex items-center gap-0 rounded-lg border border-border">
                <button
                  onClick={() => setLimitPrice((p) => Math.max(1, p - 1))}
                  className="px-3 py-2 text-muted-foreground transition-all duration-200 ease-out hover:bg-accent hover:text-foreground active:scale-90 active:bg-accent/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="min-w-[3rem] text-center text-sm font-mono font-medium text-foreground">
                  {limitPrice}¢
                </span>
                <button
                  onClick={() => setLimitPrice((p) => Math.min(99, p + 1))}
                  className="px-3 py-2 text-muted-foreground transition-all duration-200 ease-out hover:bg-accent hover:text-foreground active:scale-90 active:bg-accent/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Separator for limit mode */}
        <div
          className={cn(
            "transition-all duration-200",
            orderType === "limit"
              ? "mb-4 border-b border-border"
              : "mb-0 border-b-0"
          )}
        />

        {/* Amount / Shares input */}
        <div
          className={cn(
            "cursor-text rounded-xl border px-3 py-3 transition-all duration-200",
            belowMin
              ? "border-destructive shadow-[0_0_0_1px_hsl(var(--destructive)/0.2)]"
              : "border-border focus-within:border-foreground/30 focus-within:shadow-[0_0_0_1px_hsl(var(--foreground)/0.1)]",
            "bg-card"
          )}
          onClick={() => (isBuy ? amountRef : sharesRef).current?.focus()}
        >
          <label className="mb-1 block text-sm font-medium text-foreground">
            {isBuy ? "金额" : "份额"}
          </label>
          <div className="flex items-center">
            {isBuy && (
              <span
                className={cn(
                  "text-2xl font-semibold transition-colors duration-200",
                  amountNum > 0 ? "text-foreground" : "text-muted-foreground/30"
                )}
              >
                $
              </span>
            )}
            <input
              ref={isBuy ? amountRef : sharesRef}
              type="number"
              inputMode="decimal"
              placeholder="0"
              value={isBuy ? amount : shares}
              onChange={(e) =>
                isBuy ? setAmount(e.target.value) : setShares(e.target.value)
              }
              className={cn(
                "w-full min-w-0 border-0 bg-transparent text-right text-2xl font-semibold text-foreground outline-none placeholder:text-muted-foreground/30 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
                "transition-[opacity] duration-150 ease-out",
                inputFlash && "opacity-70"
              )}
            />
          </div>
        </div>

        {/* Error message — normal flow with slide */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-200 ease-out",
            belowMin ? "max-h-6 opacity-100 mt-1.5" : "max-h-0 opacity-0 mt-0"
          )}
        >
          <p className="text-xs text-destructive">
            最低交易金额为 ${MIN_AMOUNT}
          </p>
        </div>

        <div className="mb-3" />

        {/* Quick buttons */}
        <div className="mb-4 flex gap-2">
          {isBuy ? (
            <>
              {[1, 5, 10, 100].map((v) => (
                <button
                  key={v}
                  onClick={() => addAmount(v)}
                  className={cn(
                    ...quickBtnClass,
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 focus-visible:ring-offset-1 focus-visible:ring-offset-card"
                  )}
                >
                  +${v}
                </button>
              ))}
              <button
                onClick={() => setAmount("1000")}
                className={cn(
                  ...quickBtnClass,
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 focus-visible:ring-offset-1 focus-visible:ring-offset-card"
                )}
              >
                最大
              </button>
            </>
          ) : (
            <>
              {[-100, -10, 10, 100].map((v) => (
                <button
                  key={v}
                  onClick={() => addAmount(v)}
                  className={cn(
                    ...quickBtnClass,
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 focus-visible:ring-offset-1 focus-visible:ring-offset-card"
                  )}
                >
                  {v > 0 ? "+" : ""}{v}
                </button>
              ))}
              <button
                onClick={() => setShares("500")}
                className={cn(
                  ...quickBtnClass,
                  "!text-interactive",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive/30 focus-visible:ring-offset-1 focus-visible:ring-offset-card"
                )}
              >
                最大
              </button>
            </>
          )}
        </div>

        {/* Submit */}
        <button
          disabled={!isValid || submitting}
          onClick={handleSubmit}
          className={cn(
            submitClass,
            "transition-all duration-200 ease-out",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-card",
            isBuy
              ? outcome === "up"
                ? "focus-visible:ring-yes/50"
                : "focus-visible:ring-no/50"
              : "focus-visible:ring-interactive/50",
            "disabled:cursor-not-allowed disabled:opacity-30",
          )}
        >
          <span className="relative flex items-center justify-center gap-2">
            {submitting ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="opacity-25"
                  />
                  <path
                    d="M4 12a8 8 0 018-8"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="opacity-75"
                  />
                </svg>
                处理中...
              </>
            ) : (
              submitText
            )}
          </span>
        </button>

        {/* Summary — always rendered */}
        <div
          className={cn(
            "grid transition-all duration-300 ease-out",
            isValid
              ? "mt-3 grid-rows-[1fr] opacity-100"
              : "mt-0 grid-rows-[0fr] opacity-0"
          )}
        >
          <div className="overflow-hidden">
            <div className="space-y-1.5 text-sm">
              {orderType === "limit" && (
                <div className="flex justify-between text-muted-foreground">
                  <span>限价</span>
                  <AnimatedNumber
                    value={`${limitPrice}¢`}
                    className="font-mono"
                  />
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>{isBuy ? "平均价格" : "卖出价格"}</span>
                <AnimatedNumber
                  value={`${(effectivePrice * 100).toFixed(1)}¢`}
                  className="font-mono"
                />
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>{isBuy ? "股份" : "总计"}</span>
                <AnimatedNumber
                  value={
                    isBuy
                      ? computedShares.toFixed(2)
                      : `$${computedTotal.toFixed(2)}`
                  }
                  className="font-mono"
                />
              </div>
              <div className="flex justify-between font-medium text-foreground">
                <span>{isBuy ? "预期收益" : "赢取"}</span>
                <AnimatedNumber
                  value={`$${(isBuy ? payout : computedTotal).toFixed(2)}`}
                  className={cn(
                    "font-mono",
                    isBuy
                      ? outcome === "up" ? "text-yes" : "text-no"
                      : "text-interactive"
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
