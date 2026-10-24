import type { SleepUser } from "@/lib/sleep-data";

export interface FormulaWeights {
  duration: number;
  deep: number;
  rem: number;
  consistency: number;
  restingHr: number;
}

export const DEFAULT_WEIGHTS: FormulaWeights = { duration: 35, deep: 25, rem: 20, consistency: 10, restingHr: 10 };

export interface FormulaPreset {
  id: string;
  name: string;
  emoji: string;
  description: string;
  weights: FormulaWeights;
}

export const PRESETS: FormulaPreset[] = [
  { id: "balanced", name: "Balanced", emoji: "⚖️", description: "The standard Sleeple formula — a fair mix of every metric.", weights: { ...DEFAULT_WEIGHTS } },
  { id: "recovery", name: "Recovery Focus", emoji: "💤", description: "For athletes and heavy training weeks — deep sleep and resting heart rate matter most.", weights: { duration: 20, deep: 40, rem: 15, consistency: 5, restingHr: 20 } },
  { id: "nightowl", name: "Night Owl Special", emoji: "🦉", description: "Rewards long sleep and a steady bedtime, forgiving on deep-sleep-heavy trackers.", weights: { duration: 40, deep: 15, rem: 15, consistency: 25, restingHr: 5 } },
];

export const WEIGHT_META: { key: keyof FormulaWeights; label: string; hint: string }[] = [
  { key: "duration", label: "Total Duration", hint: "How long you slept" },
  { key: "deep", label: "Deep Sleep", hint: "Physical recovery" },
  { key: "rem", label: "REM Sleep", hint: "Memory & mood" },
  { key: "consistency", label: "Consistency / Bedtime", hint: "Regular sleep window" },
  { key: "restingHr", label: "Resting Heart Rate", hint: "Overnight recovery signal" },
];

/**
 * Set one weight and rebalance the others proportionally so the total stays 100.
 */
export function rebalance(weights: FormulaWeights, changed: keyof FormulaWeights, value: number): FormulaWeights {
  const clamped = Math.round(Math.min(90, Math.max(0, value)));
  const others = (Object.keys(weights) as (keyof FormulaWeights)[]).filter((k) => k !== changed);
  const remaining = 100 - clamped;
  const othersTotal = others.reduce((s, k) => s + weights[k], 0);

  const next = { ...weights, [changed]: clamped };
  if (othersTotal === 0) {
    const each = Math.floor(remaining / others.length);
    others.forEach((k) => (next[k] = each));
    next[others[others.length - 1]!] = remaining - each * (others.length - 1);
    return next;
  }
  let assigned = 0;
  others.forEach((k, i) => {
    if (i === others.length - 1) {
      next[k] = remaining - assigned;
    } else {
      next[k] = Math.round((weights[k] / othersTotal) * remaining);
      assigned += next[k];
    }
  });
  return next;
}

/** Normalized 0-100 sub-scores for a user, using the same baselines as the standard score. */
function subScores(u: SleepUser) {
  return {
    duration: Math.min(100, (u.durationMin / 480) * 100),
    deep: Math.min(100, (u.deepPct / 25) * 100),
    rem: Math.min(100, (u.remPct / 25) * 100),
    consistency: Math.min(100, u.efficiency + 5), // efficiency proxies bedtime regularity
    restingHr: Math.min(100, Math.max(0, ((70 - u.restingHr) / 25) * 100)),
  };
}

export function customScore(u: SleepUser, w: FormulaWeights): number {
  const s = subScores(u);
  const raw = (s.duration * w.duration + s.deep * w.deep + s.rem * w.rem + s.consistency * w.consistency + s.restingHr * w.restingHr) / 100;
  return Math.round(Math.min(100, Math.max(0, raw)));
}

export function scoreBreakdown(u: SleepUser, w: FormulaWeights) {
  const s = subScores(u);
  return (Object.keys(w) as (keyof FormulaWeights)[]).map((k) => ({
    key: k,
    contribution: Math.round(((s[k] * w[k]) / 100) * 10) / 10,
  }));
}
