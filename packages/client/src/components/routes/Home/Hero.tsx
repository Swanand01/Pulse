import { Globe, Lock, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";
import { Button } from "@/components/ui/button";

const FEATURES = [
  { icon: Lock, label: "End-to-end encrypted", shortLabel: "Encrypted" },
  { icon: Zap, label: "Zero server uploads", shortLabel: "No uploads" },
  { icon: Globe, label: "Works anywhere", shortLabel: "Anywhere" },
];

// 4 corner nodes — ring connections only, no diagonals
const NODES = [
  { id: "a", cx: 175, cy: 130, label: "Alex" },
  { id: "b", cx: 625, cy: 115, label: "Sam" },
  { id: "c", cx: 665, cy: 460, label: "Jordan" },
  { id: "d", cx: 135, cy: 470, label: "Casey" },
];

const EDGES: [string, string][] = [
  ["a", "b"],
  ["b", "c"],
  ["c", "d"],
  ["d", "a"],
  ["a", "c"],
  ["b", "d"],
];

function DemoGraph() {
  return (
    <svg
      viewBox="0 0 800 620"
      className="w-full h-full"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <filter id="node-glow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Edges */}
      {EDGES.map(([fromId, toId]) => {
        const from = NODES.find((n) => n.id === fromId)!;
        const to = NODES.find((n) => n.id === toId)!;
        return (
          <line
            key={`${fromId}-${toId}`}
            x1={from.cx}
            y1={from.cy}
            x2={to.cx}
            y2={to.cy}
            stroke="hsl(173 45% 42% / 0.35)"
            strokeWidth="1.5"
            strokeDasharray="6 5"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="-22"
              dur="1.4s"
              repeatCount="indefinite"
            />
          </line>
        );
      })}

      {/* Nodes */}
      {NODES.map(({ id, cx, cy, label }) => (
        <g key={id} filter="url(#node-glow)">
          <circle
            cx={cx}
            cy={cy}
            r="34"
            fill="hsl(214 17% 8%)"
            stroke="hsl(173 45% 42% / 0.5)"
            strokeWidth="1.5"
          />
          <text
            x={cx}
            y={cy + 5}
            textAnchor="middle"
            fill="hsl(218 7% 62%)"
            fontSize="12"
            fontFamily="Inter Variable, sans-serif"
          >
            {label}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function Hero() {
  const roomId = uuidV4();
  const btnLink = `/${roomId}`;

  return (
    <section className="relative flex flex-col items-center flex-1 overflow-hidden snap-start px-6 py-8">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none [background:radial-gradient(ellipse_60%_50%_at_50%_50%,hsl(var(--primary)/0.1)_0%,transparent_70%)]" />

      {/* SVG decorative graph — hidden on mobile */}
      <div className="absolute inset-0 hidden sm:block pointer-events-none opacity-40">
        <DemoGraph />
      </div>

      {/* Radial vignette — clears center, soft outer fade */}
      <div className="absolute inset-0 hidden sm:block pointer-events-none [background:radial-gradient(ellipse_52%_48%_at_50%_50%,hsl(var(--background))_28%,transparent_62%,hsl(var(--background)/0.55)_88%)]" />

      {/* Edge fades — all four sides */}
      <div className="absolute top-0 inset-x-0 h-36 pointer-events-none bg-gradient-to-b from-background to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-40 pointer-events-none bg-gradient-to-t from-background to-transparent" />
      <div className="absolute left-0 inset-y-0 w-24 pointer-events-none bg-gradient-to-r from-background to-transparent" />
      <div className="absolute right-0 inset-y-0 w-24 pointer-events-none bg-gradient-to-l from-background to-transparent" />

      {/* Content — grows to fill space, centers itself */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center text-center gap-5 max-w-lg w-full">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1 text-xs font-medium text-primary tracking-wide">
          <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
          No uploads · No accounts · Just share
        </span>

        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight leading-none">
          Pulse<span className="text-primary">.</span>
        </h1>

        <p className="text-base sm:text-base text-muted-foreground max-w-xs leading-relaxed">
          Share files instantly, browser to browser. Your files never touch a
          server.
        </p>

        <Link to={btnLink} className="w-full sm:w-fit mt-1">
          <Button
            size="lg"
            className="rounded-full px-8 font-medium w-full sm:w-fit"
          >
            Start Sharing
          </Button>
        </Link>
      </div>

      {/* Feature strip */}
      <div className="relative z-10 flex justify-center gap-5 sm:gap-10 pb-2">
        {FEATURES.map(({ icon: Icon, label, shortLabel }) => (
          <div
            key={label}
            className="flex items-center gap-1.5 text-sm sm:text-xs text-muted-foreground/60 whitespace-nowrap"
          >
            <Icon className="h-3.5 w-3.5 shrink-0" />
            <span className="sm:hidden">{shortLabel}</span>
            <span className="hidden sm:inline">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
