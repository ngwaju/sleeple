import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, RotateCcw, Save, SlidersHorizontal, Sparkles } from "lucide-react";
import { me } from "@/lib/sleep-data";
import { DEFAULT_WEIGHTS, PRESETS, WEIGHT_META, customScore, rebalance, scoreBreakdown, type FormulaWeights } from "@/lib/formula";

export const Route = createFileRoute("/formula")({
  head: () => ({
    meta: [
      { title: "Formula Builder — Sleeple" },
      { name: "description", content: "Tune how each metric weighs into your Unified Sleep Score." },
      { property: "og:title", content: "Formula Builder — Sleeple" },
      { property: "og:description", content: "Tune how each metric weighs into your Unified Sleep Score." },
    ],
  }),
  component: FormulaBuilder,
});

function FormulaBuilder() {
  const [weights, setWeights] = useState<FormulaWeights>({ ...DEFAULT_WEIGHTS });
  const [activePreset, setActivePreset] = useState<string>("balanced");
  const [saved, setSaved] = useState(false);

  const score = customScore(me, weights);
  const delta = score - me.score;
  const breakdown = scoreBreakdown(me, weights);

  const apply = (w: FormulaWeights, presetId: string | null) => {
    setWeights(w);
    setActivePreset(presetId ?? "custom");
    setSaved(false);
  };

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-6 py-8">
      <div className="glass flex items-start gap-3 p-4 text-sm">
        <SlidersHorizontal className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <p className="text-muted-foreground">
          <span className="font-semibold text-foreground">Your score, your rules.</span> Drag the sliders to decide how much
          each metric counts. The weights always auto-balance to 100%, and your score updates live.
        </p>
      </div>

      {/* Presets */}
      <section className="grid gap-4 md:grid-cols-3">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            onClick={() => apply({ ...p.weights }, p.id)}
            className={`glass p-5 text-left transition hover:glow-cyan ${activePreset === p.id ? "ring-2 ring-primary glow-cyan" : ""}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl">{p.emoji}</span>
              {activePreset === p.id && <Check className="h-5 w-5 text-primary" />}
            </div>
            <div className="mt-2 font-semibold">{p.name}</div>
            <p className="mt-1 text-xs text-muted-foreground">{p.description}</p>
          </button>
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Sliders */}
        <section className="glass space-y-6 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Metric Weights</h2>
            <button
              onClick={() => apply({ ...DEFAULT_WEIGHTS }, "balanced")}
              className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs text-muted-foreground transition hover:text-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </button>
          </div>
          {WEIGHT_META.map(({ key, label, hint }) => (
            <div key={key}>
              <div className="mb-2 flex items-baseline justify-between">
                <div>
                  <span className="font-medium">{label}</span>
                  <span className="ml-2 text-xs text-muted-foreground">{hint}</span>
                </div>
                <span className="text-lg font-bold text-primary">{weights[key]}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={90}
                value={weights[key]}
                onChange={(e) => apply(rebalance(weights, key, Number(e.target.value)), null)}
                className="w-full accent-[var(--primary)]"
                aria-label={label}
              />
            </div>
          ))}
          <p className="text-xs text-muted-foreground">
            Total: <span className="font-semibold text-foreground">{Object.values(weights).reduce((a, b) => a + b, 0)}%</span> — always balanced automatically.
          </p>
        </section>

        {/* Live preview */}
        <aside className="glass h-fit space-y-5 p-6">
          <h2 className="text-lg font-semibold">Live Preview</h2>
          <div className="flex items-end justify-between rounded-xl border border-border bg-secondary/40 p-4">
            <div>
              <div className="text-xs text-muted-foreground">Standard Score</div>
              <div className="text-2xl font-bold text-muted-foreground">{me.score}</div>
            </div>
            <Sparkles className="h-5 w-5 text-accent" />
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Your Formula</div>
              <div className="text-4xl font-extrabold text-gradient">{score}</div>
            </div>
          </div>
          <div className={`rounded-full px-3 py-1.5 text-center text-sm font-medium ${delta >= 0 ? "bg-primary/15 text-primary" : "bg-accent/15 text-accent"}`}>
            {delta >= 0 ? "+" : ""}{delta} pts vs standard formula
          </div>
          <div className="space-y-2">
            {breakdown.map((b) => {
              const meta = WEIGHT_META.find((m) => m.key === b.key)!;
              return (
                <div key={b.key} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{meta.label}</span>
                  <span className="font-medium">{b.contribution.toFixed(1)} pts</span>
                </div>
              );
            })}
          </div>
          <button
            onClick={() => setSaved(true)}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-glow px-4 py-2.5 text-sm font-semibold text-primary-foreground transition glow-cyan"
          >
            {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            {saved ? "Applied to Friend Group" : "Save & Apply to Friend Group"}
          </button>
          {saved && <p className="text-center text-xs text-muted-foreground">Your friends will see scores recalculated with this formula.</p>}
        </aside>
      </div>
    </main>
  );
}
