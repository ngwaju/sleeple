export type Device = "Apple Watch" | "Garmin" | "Fitbit" | "Oura Ring" | "Google Pixel Watch";
export type Chronotype = "Lion" | "Bear" | "Wolf" | "Dolphin";

export const chronoEmoji: Record<Chronotype, string> = { Lion: "🦁", Bear: "🐻", Wolf: "🐺", Dolphin: "🐬" };

export interface SleepUser {
  id: string;
  name: string;
  device: Device;
  chronotype: Chronotype;
  level: number;
  xp: number; // 0-100 progress to next level
  score: number;
  durationMin: number;
  deepPct: number;
  remPct: number;
  efficiency: number;
  restingHr: number;
  history: number[]; // 30 days of unified scores
}

function series(seed: number, base: number): number[] {
  let s = seed;
  return Array.from({ length: 30 }, () => {
    s = (s * 9301 + 49297) % 233280;
    return Math.round(Math.min(100, Math.max(50, base + (s / 233280 - 0.5) * 18)));
  });
}

export const users: SleepUser[] = [
  { id: "you", name: "You", device: "Apple Watch", chronotype: "Lion", level: 5, xp: 62, score: 88, durationMin: 452, deepPct: 21, remPct: 24, efficiency: 93, restingHr: 54, history: series(3, 84) },
  { id: "alex", name: "Alex", device: "Garmin", chronotype: "Lion", level: 12, xp: 30, score: 85, durationMin: 438, deepPct: 19, remPct: 22, efficiency: 91, restingHr: 51, history: series(7, 82) },
  { id: "sarah", name: "Sarah", device: "Fitbit", chronotype: "Bear", level: 9, xp: 75, score: 81, durationMin: 470, deepPct: 17, remPct: 25, efficiency: 88, restingHr: 58, history: series(11, 79) },
  { id: "marcus", name: "Marcus", device: "Apple Watch", chronotype: "Wolf", level: 15, xp: 12, score: 90, durationMin: 425, deepPct: 23, remPct: 21, efficiency: 94, restingHr: 49, history: series(19, 87) },
  { id: "elena", name: "Elena", device: "Oura Ring", chronotype: "Dolphin", level: 7, xp: 48, score: 76, durationMin: 401, deepPct: 15, remPct: 20, efficiency: 86, restingHr: 61, history: series(23, 74) },
  { id: "david", name: "David", device: "Google Pixel Watch", chronotype: "Bear", level: 4, xp: 88, score: 79, durationMin: 462, deepPct: 18, remPct: 23, efficiency: 87, restingHr: 57, history: series(29, 77) },
];

export const me = users[0];

export const fmtDuration = (m: number) => `${Math.floor(m / 60)}h ${m % 60}m`;
