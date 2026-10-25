import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { chronoEmoji, type Chronotype, type Device } from "@/lib/sleep-data";

export const Route = createFileRoute("/account")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Your account — Sleeple" },
      { name: "description", content: "Manage your Sleeple profile, chronotype and wearable." },
      { property: "og:title", content: "Your account — Sleeple" },
      { property: "og:description", content: "Manage your Sleeple profile, chronotype and wearable." },
    ],
  }),
  component: Account,
});

const chronos: Chronotype[] = ["Lion", "Bear", "Wolf", "Dolphin"];
const devices: Device[] = ["Google Pixel Watch", "Fitbit", "Apple Watch", "Garmin", "Oura Ring"];

function Account() {
  const { user, profile, loading, setProfile } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) setName(profile.display_name ?? "");
  }, [profile]);

  if (loading) return <main className="p-16 text-center text-muted-foreground">Loading…</main>;
  if (!user)
    return (
      <main className="mx-auto max-w-md px-6 py-16 text-center">
        <div className="glass p-8">
          <p className="mb-4">Sign in to see your account.</p>
          <Link to="/auth" className="rounded-full bg-gradient-glow px-5 py-2 text-sm font-semibold text-primary-foreground">Sign in</Link>
        </div>
      </main>
    );

  const update = async (patch: Partial<NonNullable<typeof profile>>) => {
    const { data } = await supabase.from("profiles").update(patch).eq("id", user.id).select().maybeSingle();
    if (data) setProfile(data as typeof profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  return (
    <main className="mx-auto max-w-2xl space-y-6 px-6 py-8">
      <section className="glass p-6">
        <h1 className="text-2xl font-bold text-gradient">Your account</h1>
        <p className="text-sm text-muted-foreground">{user.email} • Level {profile?.level ?? 1}</p>
        <label className="mt-5 block text-sm font-medium">Display name</label>
        <div className="mt-1 flex gap-2">
          <input value={name} onChange={(e) => setName(e.target.value)} className="flex-1 rounded-xl border border-border bg-background px-4 py-2 text-sm" />
          <button onClick={() => update({ display_name: name })} className="rounded-full bg-gradient-glow px-4 text-sm font-semibold text-primary-foreground">Save</button>
        </div>
        <label className="mt-5 block text-sm font-medium">Chronotype</label>
        <div className="mt-1 flex flex-wrap gap-2">
          {chronos.map((c) => (
            <button key={c} onClick={() => update({ chronotype: c })}
              className={`rounded-full px-3 py-1.5 text-sm ${profile?.chronotype === c ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
              {chronoEmoji[c]} {c}
            </button>
          ))}
        </div>
        <label className="mt-5 block text-sm font-medium">Main wearable</label>
        <div className="mt-1 flex flex-wrap gap-2">
          {devices.map((d) => (
            <button key={d} onClick={() => update({ device: d })}
              className={`rounded-full px-3 py-1.5 text-sm ${profile?.device === d ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
              {d}
            </button>
          ))}
        </div>
        {saved && <p className="mt-3 text-sm text-primary">Saved</p>}
      </section>
      <button onClick={signOut} className="rounded-full bg-secondary px-5 py-2 text-sm">Sign out</button>
    </main>
  );
}
