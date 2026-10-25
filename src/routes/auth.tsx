import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Moon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Sleeple" },
      { name: "description", content: "Sign in to Sleeple to sync your sleep and compare with friends." },
      { property: "og:title", content: "Sign in — Sleeple" },
      { property: "og:description", content: "Sign in to Sleeple to sync your sleep and compare with friends." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) navigate({ to: "/account" });
  }, [user, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    if (mode === "up") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin + import.meta.env.BASE_URL },
      });
      setMsg(error ? error.message : "Check your email to confirm your account.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMsg(error.message);
    }
    setBusy(false);
  };

  const google = async () => {
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + import.meta.env.BASE_URL });
    if (res.error) setMsg(res.error.message);
  };

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <div className="glass p-8">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-gradient-glow">
            <Moon className="h-6 w-6 text-primary-foreground" />
          </span>
          <h1 className="text-2xl font-bold text-gradient">{mode === "in" ? "Welcome back" : "Create your account"}</h1>
          <p className="text-sm text-muted-foreground">Sync your wearable and compare sleep fairly.</p>
        </div>
        <button onClick={google} className="w-full rounded-full border border-border bg-card px-4 py-2.5 text-sm font-medium transition hover:bg-secondary">
          Continue with Google
        </button>
        <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
        </div>
        <form onSubmit={submit} className="space-y-3">
          <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary" />
          <input type="password" required minLength={6} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary" />
          <button disabled={busy} className="w-full rounded-full bg-gradient-glow px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60">
            {mode === "in" ? "Sign in" : "Sign up"}
          </button>
        </form>
        {msg && <p className="mt-4 text-center text-sm text-muted-foreground">{msg}</p>}
        <button onClick={() => setMode(mode === "in" ? "up" : "in")} className="mt-4 w-full text-center text-sm text-primary">
          {mode === "in" ? "New here? Create an account" : "Already have an account? Sign in"}
        </button>
      </div>
    </main>
  );
}
