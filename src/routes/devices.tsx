import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, Check, Link2, RefreshCw, Shield, Unlink, Watch } from "lucide-react";
import { me, users, type Device } from "@/lib/sleep-data";

export const Route = createFileRoute("/devices")({
  head: () => ({
    meta: [
      { title: "Devices & Settings — Sleeple" },
      { name: "description", content: "Connect Fitbit, Garmin, Apple Health, Oura and Pixel Watch." },
      { property: "og:title", content: "Devices & Settings — Sleeple" },
      { property: "og:description", content: "Connect Fitbit, Garmin, Apple Health, Oura and Pixel Watch." },
    ],
  }),
  component: Devices,
});

const allDevices: { name: Device; lastSync: string; connected: boolean }[] = [
  { name: "Apple Watch", lastSync: "12 min ago", connected: true },
  { name: "Garmin", lastSync: "Not connected", connected: false },
  { name: "Fitbit", lastSync: "Not connected", connected: false },
  { name: "Oura Ring", lastSync: "Not connected", connected: false },
  { name: "Google Pixel Watch", lastSync: "Not connected", connected: false },
];

const settings = [
  { icon: Bell, title: "Sleep score notifications", desc: "Get a morning summary when your score is ready", on: true },
  { icon: RefreshCw, title: "Auto-sync overnight", desc: "Pull data from your wearable while you sleep", on: true },
  { icon: Shield, title: "Share raw metrics with friends", desc: "Off = friends only see your normalized score", on: false },
];

function Devices() {
  const [devices, setDevices] = useState(allDevices);
  const [toggles, setToggles] = useState(settings.map((s) => s.on));

  const toggleDevice = (name: Device) =>
    setDevices((ds) => ds.map((d) => (d.name === name ? { ...d, connected: !d.connected, lastSync: d.connected ? "Not connected" : "Just now" } : d)));

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-6 py-8">
      <section className="glass p-6">
        <div className="mb-5 flex items-center gap-2">
          <Watch className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Connected Devices</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {devices.map((d) => (
            <div key={d.name} className={`rounded-xl border p-4 transition ${d.connected ? "border-primary/40 bg-primary/10 glow-cyan" : "border-border bg-secondary/40"}`}>
              <div className="flex items-center justify-between">
                <span className="font-medium">{d.name}</span>
                {d.connected && <span className="flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary"><Check className="h-3 w-3" /> Connected</span>}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{d.connected ? `Last sync: ${d.lastSync}` : "Not connected"}</p>
              <button
                onClick={() => toggleDevice(d.name)}
                className={`mt-3 flex w-full items-center justify-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition ${d.connected ? "bg-secondary text-muted-foreground hover:text-foreground" : "bg-gradient-glow text-primary-foreground"}`}
              >
                {d.connected ? <><Unlink className="h-4 w-4" /> Disconnect</> : <><Link2 className="h-4 w-4" /> Connect</>}
              </button>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Your group uses {new Set(users.map((u) => u.device)).size} different wearables — Sleeple normalizes them all against device-specific baselines.
        </p>
      </section>

      <section className="glass p-6">
        <h2 className="mb-5 text-lg font-semibold">Settings</h2>
        <div className="space-y-3">
          {settings.map((s, i) => (
            <div key={s.title} className="flex items-center gap-4 rounded-xl border border-border bg-secondary/40 p-4">
              <s.icon className="h-5 w-5 shrink-0 text-primary" />
              <div className="flex-1">
                <div className="text-sm font-medium">{s.title}</div>
                <div className="text-xs text-muted-foreground">{s.desc}</div>
              </div>
              <button
                role="switch"
                aria-checked={toggles[i]}
                aria-label={s.title}
                onClick={() => setToggles((t) => t.map((v, j) => (j === i ? !v : v)))}
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${toggles[i] ? "bg-gradient-glow" : "bg-secondary"}`}
              >
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-primary-foreground shadow transition-all ${toggles[i] ? "left-5.5" : "left-0.5"}`} style={{ left: toggles[i] ? "1.375rem" : "0.125rem" }} />
              </button>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">Signed in as <span className="font-medium text-foreground">{me.name}</span> • {me.device} • Level {me.level}</p>
      </section>
    </main>
  );
}
