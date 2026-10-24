import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Gamepad2, Heart, MessageCircle, Sparkles, X } from "lucide-react";
import { users, me, chronoEmoji, type Chronotype } from "@/lib/sleep-data";

export const Route = createFileRoute("/social")({
  head: () => ({
    meta: [
      { title: "Chronotypes & Social — Sleeple" },
      { name: "description", content: "Discover your chronotype and see how friends sleep." },
      { property: "og:title", content: "Chronotypes & Social — Sleeple" },
      { property: "og:description", content: "Discover your chronotype and see how friends sleep." },
    ],
  }),
  component: Social,
});

const chronoInfo: Record<Chronotype, { wake: number; bed: number; peak: string; desc: string }> = {
  Lion: { wake: 6, bed: 22, peak: "6–10 AM", desc: "Early riser. Sharpest in the morning, winds down early." },
  Bear: { wake: 7, bed: 23, peak: "10 AM–2 PM", desc: "Follows the sun. Steady energy through midday." },
  Wolf: { wake: 9, bed: 1, peak: "5–10 PM", desc: "Night owl. Comes alive in the evening." },
  Dolphin: { wake: 7, bed: 0, peak: "10 AM–12 PM", desc: "Light sleeper. Best in short late-morning bursts." },
};

const feed = [
  { id: 1, user: "marcus", text: "reached Level 16! 🏆", time: "2h ago", kudos: 4 },
  { id: 2, user: "sarah", text: "earned the Deep Sleep Dynamo badge ⚡", time: "5h ago", kudos: 7 },
  { id: 3, user: "alex", text: "hit a 12-night sleep streak 🔥", time: "8h ago", kudos: 3 },
  { id: 4, user: "david", text: "improved his score by +5 this week 📈", time: "1d ago", kudos: 5 },
  { id: 5, user: "elena", text: "completed the 7-Night Streak challenge 🌙", time: "1d ago", kudos: 6 },
];

const quizQuestions = [
  { q: "When do you naturally wake up on a free day?", opts: [["Before 6:30 AM", "Lion"], ["7–8 AM", "Bear"], ["After 9 AM", "Wolf"], ["It varies a lot", "Dolphin"]] },
  { q: "When do you feel most focused?", opts: [["Early morning", "Lion"], ["Late morning", "Bear"], ["Evening", "Wolf"], ["In short bursts", "Dolphin"]] },
  { q: "How easily do you fall asleep?", opts: [["Out like a light early", "Lion"], ["Pretty easily", "Bear"], ["Late, but deeply", "Wolf"], ["I struggle — light sleeper", "Dolphin"]] },
] as const;

function Social() {
  const [quizOpen, setQuizOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Chronotype[]>([]);
  const [result, setResult] = useState<Chronotype | null>(null);
  const [kudosGiven, setKudosGiven] = useState<Set<number>>(new Set());

  const answer = (c: Chronotype) => {
    const next = [...answers, c];
    setAnswers(next);
    if (step < quizQuestions.length - 1) setStep(step + 1);
    else {
      const counts = next.reduce<Record<string, number>>((acc, v) => ({ ...acc, [v]: (acc[v] ?? 0) + 1 }), {});
      setResult(Object.entries(counts).sort((a, b) => b[1] - a[1])[0]![0] as Chronotype);
    }
  };

  const closeQuiz = () => { setQuizOpen(false); setStep(0); setAnswers([]); setResult(null); };

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-6 py-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {/* Chronotype card */}
          <section className="glass p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="text-4xl">{chronoEmoji[me.chronotype]}</div>
                <h2 className="mt-2 text-2xl font-bold">You're a {me.chronotype}</h2>
                <p className="mt-1 max-w-md text-sm text-muted-foreground">{chronoInfo[me.chronotype].desc}</p>
                <p className="mt-2 text-sm"><span className="text-muted-foreground">Peak window:</span> <span className="font-medium text-primary">{chronoInfo[me.chronotype].peak}</span></p>
              </div>
              <button onClick={() => setQuizOpen(true)} className="flex items-center gap-2 rounded-full bg-gradient-glow px-4 py-2 text-sm font-semibold text-primary-foreground glow-cyan">
                <Sparkles className="h-4 w-4" /> Retake Quiz
              </button>
            </div>
          </section>

          {/* Alignment matrix */}
          <section className="glass p-6">
            <div className="mb-4 flex items-center gap-2">
              <Gamepad2 className="h-5 w-5 text-accent" />
              <h2 className="text-lg font-semibold">Circadian Alignment Matrix</h2>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">When everyone is awake and well-rested — ideal hangout & gaming windows.</p>
            <div className="space-y-2">
              {users.map((u) => {
                const info = chronoInfo[u.chronotype];
                const start = (info.wake / 24) * 100;
                const width = (((info.bed > info.wake ? info.bed : info.bed + 24) - info.wake) / 24) * 100;
                return (
                  <div key={u.id} className="flex items-center gap-3">
                    <span className="w-20 shrink-0 text-xs font-medium">{chronoEmoji[u.chronotype]} {u.name}</span>
                    <div className="relative h-6 flex-1 overflow-hidden rounded-full bg-secondary">
                      <div className="absolute inset-y-1 rounded-full bg-gradient-glow opacity-80" style={{ left: `${start}%`, width: `${width}%` }} />
                    </div>
                  </div>
                );
              })}
              <div className="flex justify-between pl-23 text-[10px] text-muted-foreground" style={{ paddingLeft: "5.75rem" }}>
                {["12 AM", "4 AM", "8 AM", "12 PM", "4 PM", "8 PM", "12 AM"].map((t, i) => <span key={i}>{t}</span>)}
              </div>
            </div>
            <div className="mt-5 rounded-xl border border-primary/30 bg-primary/10 p-4 text-sm">
              <span className="font-semibold text-primary">Best overlap: 10 AM – 2 PM.</span>{" "}
              <span className="text-muted-foreground">All six of you are awake then — Lions and Bears at peak, Wolves and Dolphins functional. Evening gaming works too, but Elena fades fast.</span>
            </div>
          </section>
        </div>

        {/* Activity feed */}
        <aside className="glass h-fit p-6">
          <h2 className="mb-4 text-lg font-semibold">Friend Activity</h2>
          <div className="space-y-4">
            {feed.map((f) => {
              const u = users.find((x) => x.id === f.user)!;
              const given = kudosGiven.has(f.id);
              return (
                <div key={f.id} className="rounded-xl border border-border bg-secondary/40 p-3">
                  <div className="text-sm">
                    <span className="font-medium">{chronoEmoji[u.chronotype]} {u.name}</span>{" "}
                    <span className="text-muted-foreground">{f.text}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-xs">
                    <button
                      onClick={() => setKudosGiven((s) => { const n = new Set(s); if (given) n.delete(f.id); else n.add(f.id); return n; })}
                      className={`flex items-center gap-1 rounded-full px-2.5 py-1 transition ${given ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
                    >
                      <Heart className={`h-3.5 w-3.5 ${given ? "fill-current" : ""}`} /> {f.kudos + (given ? 1 : 0)}
                    </button>
                    <button className="flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-muted-foreground transition hover:text-foreground">
                      <MessageCircle className="h-3.5 w-3.5" /> Comment
                    </button>
                    <span className="ml-auto text-muted-foreground">{f.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>
      </div>

      {/* Quiz modal */}
      {quizOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-background/70 p-4 backdrop-blur-sm" onClick={closeQuiz}>
          <div className="glass w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Chronotype Quiz</h3>
              <button onClick={closeQuiz} aria-label="Close quiz"><X className="h-5 w-5 text-muted-foreground" /></button>
            </div>
            {result ? (
              <div className="text-center">
                <div className="text-5xl">{chronoEmoji[result]}</div>
                <div className="mt-3 text-xl font-bold">You're a {result}!</div>
                <p className="mt-2 text-sm text-muted-foreground">{chronoInfo[result].desc}</p>
                <button onClick={closeQuiz} className="mt-5 rounded-full bg-gradient-glow px-5 py-2 text-sm font-semibold text-primary-foreground">Done</button>
              </div>
            ) : (
              <>
                <p className="mb-1 text-xs text-muted-foreground">Question {step + 1} of {quizQuestions.length}</p>
                <p className="mb-4 font-medium">{quizQuestions[step]!.q}</p>
                <div className="space-y-2">
                  {quizQuestions[step]!.opts.map(([label, c]) => (
                    <button key={label} onClick={() => answer(c)} className="w-full rounded-xl border border-border bg-secondary/40 px-4 py-3 text-left text-sm transition hover:border-primary hover:bg-primary/10">
                      {label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
