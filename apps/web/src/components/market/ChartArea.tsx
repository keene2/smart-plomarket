"use client";

import { useMemo } from "react";
import type { Event, Market, PricePoint } from "@/types/market";

// Polymarket-style multi-line chart colors
const LINE_COLORS = [
  "hsl(217, 91%, 60%)",  // blue (primary)
  "hsl(38, 92%, 50%)",   // orange
  "hsl(168, 100%, 35%)", // teal/green
  "hsl(0, 100%, 67%)",   // red
  "hsl(263, 70%, 58%)",  // purple
  "hsl(45, 93%, 47%)",   // yellow
];

function generateMultiMarketData(markets: Market[]): { marketId: string; data: PricePoint[] }[] {
  const now = Math.floor(Date.now() / 1000);
  const points = 120;
  const interval = 3600; // 1hr per point

  return markets.map((m) => {
    const yesOutcome = m.outcomes.find((o) => o.label.toLowerCase() !== "no");
    const targetPrice = yesOutcome?.price ?? 0.5;
    const data: PricePoint[] = [];
    let price = targetPrice * 0.7 + Math.random() * 0.3;

    for (let i = 0; i < points; i++) {
      const drift = (targetPrice - price) * 0.02;
      const noise = (Math.random() - 0.5) * 0.04;
      price = Math.max(0.001, Math.min(0.999, price + drift + noise));
      data.push({ time: now - (points - i) * interval, value: price });
    }
    // Last point = current price
    data.push({ time: now, value: targetPrice });
    return { marketId: m.id, data };
  });
}

export function ChartArea({
  data,
  market,
  event,
}: {
  data: PricePoint[];
  market?: Market;
  event?: Event;
}) {
  const isMultiMarket = event && event.markets.length > 1;

  const multiData = useMemo(() => {
    if (!event || !isMultiMarket) return null;
    return generateMultiMarketData(event.markets);
  }, [event, isMultiMarket]);

  const w = 800;
  const h = 280;
  const padX = 50;
  const padY = 20;
  const chartW = w - padX;
  const chartH = h - padY * 2;

  // Y-axis: always 0% to 100% for multi-market
  const yMin = isMultiMarket ? 0 : undefined;
  const yMax = isMultiMarket ? 1 : undefined;

  function renderLine(lineData: PricePoint[], color: string, minVal: number, maxVal: number) {
    const range = maxVal - minVal || 0.01;
    const points = lineData
      .map((d, i) => {
        const x = (i / (lineData.length - 1)) * chartW;
        const y = padY + ((maxVal - d.value) / range) * chartH;
        return `${x},${y}`;
      })
      .join(" ");

    return (
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    );
  }

  function renderDot(lineData: PricePoint[], color: string, minVal: number, maxVal: number) {
    if (lineData.length === 0) return null;
    const range = maxVal - minVal || 0.01;
    const last = lineData[lineData.length - 1]!;
    const x = chartW;
    const y = padY + ((maxVal - last.value) / range) * chartH;
    return <circle cx={x} cy={y} r="4" fill={color} stroke="white" strokeWidth="2" />;
  }

  // Grid lines for percentage
  const gridPercents = [0, 25, 50, 75, 100];
  const gridLines = gridPercents.map((pct) => ({
    y: padY + ((100 - pct) / 100) * chartH,
    label: `${pct}%`,
  }));

  if (isMultiMarket && multiData) {
    return (
      <div className="rounded-lg border border-border bg-card">
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="xMidYMid meet">
          {/* Grid */}
          {gridLines.map((g, i) => (
            <g key={i}>
              <line
                x1={0} y1={g.y} x2={chartW} y2={g.y}
                stroke="hsl(var(--border))"
                strokeWidth="1"
                strokeDasharray={i === 0 || i === gridLines.length - 1 ? "none" : "4,4"}
              />
              <text
                x={chartW + 8} y={g.y + 4}
                fontSize="10"
                fill="hsl(var(--muted-foreground))"
                fontFamily="var(--font-mono)"
              >
                {g.label}
              </text>
            </g>
          ))}

          {/* Lines */}
          {multiData.map((md, i) => (
            <g key={md.marketId}>
              {renderLine(md.data, LINE_COLORS[i % LINE_COLORS.length]!, 0, 1)}
              {renderDot(md.data, LINE_COLORS[i % LINE_COLORS.length]!, 0, 1)}
            </g>
          ))}

          {/* Time labels */}
          {(() => {
            if (!multiData[0]) return null;
            const d = multiData[0].data;
            const step = Math.floor(d.length / 5);
            return d.filter((_, i) => i % step === 0).map((p, i) => {
              const idx = d.indexOf(p);
              const x = (idx / (d.length - 1)) * chartW;
              const date = new Date(p.time * 1000);
              const label = `${date.getMonth() + 1}月`;
              return (
                <text
                  key={i} x={x} y={h - 4}
                  fontSize="10"
                  fill="hsl(var(--muted-foreground))"
                  textAnchor="middle"
                >
                  {label}
                </text>
              );
            });
          })()}
        </svg>
      </div>
    );
  }

  // Single market fallback
  if (data.length < 2) return null;

  const values = data.map((d) => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);

  return (
    <div className="rounded-lg border border-border bg-card">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="xMidYMid meet">
        {gridLines.map((g, i) => (
          <g key={i}>
            <line
              x1={0} y1={g.y} x2={chartW} y2={g.y}
              stroke="hsl(var(--border))"
              strokeWidth="1"
              strokeDasharray="4,4"
            />
            <text
              x={chartW + 8} y={g.y + 4}
              fontSize="10"
              fill="hsl(var(--muted-foreground))"
              fontFamily="var(--font-mono)"
            >
              {g.label}
            </text>
          </g>
        ))}

        <polygon
          points={`0,${h - padY} ${data
            .map((d, i) => {
              const x = (i / (data.length - 1)) * chartW;
              const y = padY + ((max - d.value) / (max - min || 0.01)) * chartH;
              return `${x},${y}`;
            })
            .join(" ")} ${chartW},${h - padY}`}
          fill="hsl(38, 92%, 50%)"
          opacity="0.08"
        />
        {renderLine(data, "hsl(38, 92%, 50%)", min, max)}
        {renderDot(data, "hsl(38, 92%, 50%)", min, max)}

        {data.filter((_, i) => i % Math.floor(data.length / 6) === 0).map((d, i) => {
          const idx = data.indexOf(d);
          const x = (idx / (data.length - 1)) * chartW;
          const date = new Date(d.time * 1000);
          const label = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
          return (
            <text
              key={i} x={x} y={h - 4}
              fontSize="10"
              fill="hsl(var(--muted-foreground))"
              textAnchor="middle"
            >
              {label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
