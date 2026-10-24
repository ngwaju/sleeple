import { createFileRoute } from "@tanstack/react-router";
import { Crown, Flame, Medal, Moon, Target, TrendingUp, Trophy, Zap } from "lucide-react";
import { users, chronoEmoji } from "@/lib/sleep-data";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Leaderboard & Challenges — Sleeple" },
      { name: "description", content: "Compete with friends on fair, normalized sleep scores." },
      { property: "og:title", content: "Leaderboard & Challenges — Sleeple" },
      { property: "og:description", content: "Compete with friends on fair, normalized sleep scores." },
    ],
  }),
  component: Leaderboard,
});

const streaks: Record<string, number> = { you: 6, alex: 12, sarah: 4, marcus: 21, elena: 2, david: 8 };
const weeklyDelta: Record<string, number> = { you: 3, alex: -1, sarah: 2, marcus: 1, elena: -2, david: 5 };

const challenges = [
  { icon: Moon, title: "7-Night Streak", desc: "Sleep 7+ hours, 7 nights in a row", progress: 6, goal: 7, reward: "+150 XP" },
  { icon: Zap, title: "Deep Sleep Dynamo", desc: "Average 20%+ deep sleep this week", progress: 19, goal: 20, reward: "+200 XP", unit: "%" },
  { icon: Target, title: "Consistency Champion", desc: "Bedtime within a 30-min window for 5 nights", progress: 5, goal: 5, reward: "Badge unlocked", done: true },
];

function rankIcon(i: number) {
  if (i === 0) return <Crown className="h-5 w-5 text-primary" />;
  if (i === 1) return <Medal className="h-5 w-5 text-accent" />;
  if (i === 2) return <Medal className="h-5 w-5 text-muted-foreground" />;
  return <span className="w-5 text-center text-sm text-muted-foreground">{i + 1}</span>;
}

function Leaderboard() {
  const ranked = [...users].sort((a, b) => b.score - a.score);
  return (
    <main className="mx-auto max-w-7xl space-y-6 px-6 py-8">
      {/* Weekly leaderboard */}
      <section className="glass p-6">
        <div className="mb-5 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">This Week's Standings</h2>
          <span className="ml-auto text-xs text-muted-foreground">Normalized across all devices</span>
        </div>
        <div className="space-y-2">
          {ranked.map((u, i) => {
            const d = weeklyDelta[u.id] ?? 0;
            return (
              <div
                key={u.id}
                className={`flex items-center gap-4 rounded-xl border p-3 transition ${u.id === "you" ? "border-primary/40 bg-primary/10 glow-cyan" : "border-border bg-secondary/40"}`}
              >
                <div className="w-6">{rankIcon(i)}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{u.name}</span>
                    <span className="text-xs text-muted-foreground">{chronoEmoji[u.chronotype]} {u.chronotype} • {u.device}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Flame className="h-3.5 w-3.5 text-accent" /> {streaks[u.id]}-night streak</span>
                    <span>Lv {u.level}</span>
                  </div>
                </div>
                <span className={`flex items-center gap-1 text-xs font-medium ${d >= 0 ? "text-primary" : "text-accent"}`}>
                  <TrendingUp className={`h-3.5 w-3.5 ${d < 0 ? "rotate-180" : ""}`} /> {d >= 0 ? "+" : ""}{d}
                </span>
                <span className="w-10 text-right text-2xl font-bold">{u.score}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Challenges */}
      <section>
        <h2 className="mb-4 text-lg font-semibold">Active Challenges</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {challenges.map((c) => {
            const pct = Math.min(100, (c.progress / c.goal) * 100);
            return (
              <div key={c.title} className={`glass p-5 transition hover:glow-cyan ${c.done ? "ring-2 ring-primary" : ""}`}>
                <div className="flex items-center justify-between">
                  <c.icon className="h-6 w-6 text-primary" />
                  <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-primary">{c.reward}</span>
                </div>
                <div className="mt-3 font-semibold">{c.title}</div>
                <p className="mt-1 text-xs text-muted-foreground">{c.desc}</p>
                <div className="mt-4">
                  <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                    <span>{c.progress}{c.unit ?? ""} / {c.goal}{c.unit ?? ""}</span>
                    <span>{c.done ? "Complete!" : `${Math.round(pct)}%`}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full rounded-full bg-gradient-glow" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
