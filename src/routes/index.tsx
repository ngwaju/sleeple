import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { Activity, Clock, Heart, Info, Moon, Sparkles, Zap } from "lucide-react";
import { users, me, fmtDuration, chronoEmoji, type SleepUser } from "@/lib/sleep-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Sleeple Unified Sleep Score" },
      { name: "description", content: "Your normalized 0–100 sleep score, compared fairly with friends across any wearable." },
      { property: "og:title", content: "Sleeple Dashboard" },
      { property: "og:description", content: "Your normalized 0–100 sleep score, compared fairly across wearables." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <main className="mx-auto max-w-7xl space-y-6 px-6 py-8">
      <div className="glass flex items-start gap-3 p-4 text-sm">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <p className="text-muted-foreground">
          <span className="font-semibold text-foreground">Fair by design.</span> Every wearable measures sleep differently.
          Sleeple calibrates raw stages, efficiency and heart rate from Fitbit, Garmin, Apple Health, Oura and Pixel Watch
          against device-specific baselines, then maps them onto one standardized{" "}
          <span className="text-primary">0–100 Unified Sleep Score</span>.
        </p>
      </div>
      <Hero />
      <TrendChart />
      <Compare />
    </main>
  );
}

function Ring({ value }: { value: number }) {
  const r = 80, c = 2 * Math.PI * r;
  return (
    <div className="relative h-52 w-52">
      <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
        <defs>
          <linearGradient id="rg" x1="0" x2="1">
            <stop offset="0%" stopColor="var(--primary)" />
            <stop offset="100%" stopColor="var(--neon)" />
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r={r} stroke="var(--secondary)" strokeWidth="14" fill="none" />
        <circle cx="100" cy="100" r={r} stroke="url(#rg)" strokeWidth="14" fill="none" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} style={{ filter: "drop-shadow(0 0 8px var(--neon))" }} />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="text-5xl font-extrabold text-gradient">{value}</div>
          <div className="text-xs text-muted-foreground">/ 100</div>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  const metrics = [
    { icon: Clock, label: "Total Duration", value: fmtDuration(me.durationMin) },
    { icon: Moon, label: "Deep Sleep", value: `${me.deepPct}%` },
    { icon: Sparkles, label: "REM Sleep", value: `${me.remPct}%` },
    { icon: Zap, label: "Efficiency", value: `${me.efficiency}%` },
    { icon: Heart, label: "Resting HR", value: `${me.restingHr} bpm` },
  ];
  return (
    <section className="glass grid gap-8 p-6 md:grid-cols-[auto_1fr] md:items-center">
      <div className="flex flex-col items-center">
        <Ring value={me.score} />
        <p className="mt-2 text-sm text-muted-foreground">Last night's Unified Sleep Score</p>
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-xl border border-border bg-secondary/40 p-4 transition hover:glow-cyan">
            <m.icon className="h-5 w-5 text-primary" />
            <div className="mt-3 text-2xl font-bold">{m.value}</div>
            <div className="text-xs text-muted-foreground">{m.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

const tooltipStyle = { background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, color: "var(--foreground)" };

function TrendChart() {
  const [range, setRange] = useState<7 | 30>(7);
  const data = useMemo(() => {
    const today = new Date();
    return me.history.slice(-range).map((score, i, arr) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (arr.length - 1 - i));
      const avg = Math.round(users.reduce((s, u) => s + u.history[30 - arr.length + i], 0) / users.length);
      return { day: d.toLocaleDateString("en", { month: "short", day: "numeric" }), You: score, "Friends avg": avg };
    });
  }, [range]);
  return (
    <section className="glass p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-accent" />
          <h2 className="text-lg font-semibold">Daily Unified Scores</h2>
        </div>
        <div className="flex rounded-full bg-secondary p-1 text-sm">
          {([7, 30] as const).map((r) => (
            <button key={r} onClick={() => setRange(r)}
              className={`rounded-full px-4 py-1 transition ${range === r ? "bg-gradient-glow text-primary-foreground" : "text-muted-foreground"}`}>
              {r} Days
            </button>
          ))}
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--border)" vertical={false} />
            <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis domain={[50, 100]} stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend />
            <Area type="monotone" dataKey="You" stroke="var(--primary)" strokeWidth={2.5} fill="url(#ga)" />
            <Line type="monotone" dataKey="Friends avg" stroke="var(--neon)" strokeWidth={2} strokeDasharray="5 4" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

function Picker({ value, onChange, exclude }: { value: string; onChange: (v: string) => void; exclude: string }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-input bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
      {users.filter((u) => u.id !== exclude).map((u) => (
        <option key={u.id} value={u.id}>{u.name} — {u.device}</option>
      ))}
    </select>
  );
}

function Compare() {
  const [a, setA] = useState("sarah");
  const [b, setB] = useState("marcus");
  const ua = users.find((u) => u.id === a)!;
  const ub = users.find((u) => u.id === b)!;
  const rows: { label: string; key: keyof SleepUser; unit: string; lowerBetter?: boolean; max: number }[] = [
    { label: "Deep Sleep", key: "deepPct", unit: "%", max: 30 },
    { label: "REM Sleep", key: "remPct", unit: "%", max: 30 },
    { label: "Resting HR", key: "restingHr", unit: " bpm", lowerBetter: true, max: 80 },
  ];
  return (
    <section className="glass p-6">
      <h2 className="mb-4 text-lg font-semibold">Side-by-Side Device Comparison</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {[{ u: ua, set: setA, ex: b }, { u: ub, set: setB, ex: a }].map(({ u, set, ex }, i) => (
          <div key={i} className="rounded-xl border border-border bg-secondary/40 p-4">
            <Picker value={u.id} onChange={set} exclude={ex} />
            <div className="mt-3 flex items-center justify-between text-sm">
              <span>{chronoEmoji[u.chronotype]} {u.chronotype} • Lv {u.level}</span>
              <span className={`text-2xl font-bold ${i === 0 ? "text-primary" : "text-accent"}`}>{u.score}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 space-y-5">
        {rows.map((r) => {
          const va = ua[r.key] as number, vb = ub[r.key] as number;
          const aWins = r.lowerBetter ? va < vb : va > vb;
          return (
            <div key={r.label}>
              <div className="mb-1 flex justify-between text-sm">
                <span className={aWins ? "font-bold text-primary" : "text-muted-foreground"}>{va}{r.unit}</span>
                <span className="text-muted-foreground">{r.label}</span>
                <span className={!aWins && va !== vb ? "font-bold text-accent" : "text-muted-foreground"}>{vb}{r.unit}</span>
              </div>
              <div className="flex gap-1">
                <div className="flex h-2 flex-1 justify-end overflow-hidden rounded-full bg-secondary">
                  <div className="h-full rounded-full bg-primary glow-cyan" style={{ width: `${(va / r.max) * 100}%` }} />
                </div>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full rounded-full bg-accent glow-neon" style={{ width: `${(vb / r.max) * 100}%` }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
