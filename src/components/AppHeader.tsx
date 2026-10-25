import { Link } from "@tanstack/react-router";
import { Moon, Watch } from "lucide-react";
import { chronoEmoji, type Chronotype } from "@/lib/sleep-data";
import { useAuth } from "@/hooks/use-auth";

const tabs = [
  { to: "/", label: "Dashboard" },
  { to: "/formula", label: "Formula Builder" },
  { to: "/leaderboard", label: "Leaderboard & Challenges" },
  { to: "/social", label: "Chronotypes & Social" },
  { to: "/devices", label: "Devices & Settings" },
] as const;

export function AppHeader() {
  const { user, profile } = useAuth();
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-glow glow-neon">
            <Moon className="h-5 w-5 text-primary-foreground" />
          </span>
          <span className="text-xl font-bold tracking-tight text-gradient">Sleeple</span>
        </Link>
        <nav className="order-3 flex w-full gap-1 overflow-x-auto lg:order-none lg:w-auto lg:flex-1 lg:justify-center">
          {tabs.map((t) => (
            <Link
              key={t.to}
              to={t.to}
              activeOptions={{ exact: true }}
              className="whitespace-nowrap rounded-full px-3 py-1.5 text-sm text-muted-foreground transition hover:text-foreground"
              activeProps={{ className: "bg-secondary text-primary glow-cyan" }}
            >
              {t.label}
            </Link>
          ))}
        </nav>
        {user ? (
          <Link to="/account" className="ml-auto glass flex items-center gap-3 rounded-full px-4 py-2 text-sm">
            <div>
              <div className="font-medium">
                {profile?.display_name ?? "You"} • Level {profile?.level ?? 1} •{" "}
                {chronoEmoji[(profile?.chronotype ?? "Bear") as Chronotype]} {profile?.chronotype} •{" "}
                <Watch className="inline h-3.5 w-3.5 text-primary" /> {profile?.device}
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                <div className="h-full bg-gradient-glow" style={{ width: `${profile?.xp ?? 0}%` }} />
              </div>
            </div>
          </Link>
        ) : (
          <Link to="/auth" className="ml-auto rounded-full bg-gradient-glow px-5 py-2 text-sm font-semibold text-primary-foreground">
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}

export function ComingSoon({ title, text }: { title: string; text: string }) {
  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="glass p-10 text-center">
        <h1 className="text-3xl font-bold text-gradient">{title}</h1>
        <p className="mt-3 text-muted-foreground">{text}</p>
        <p className="mt-6 text-xs uppercase tracking-widest text-accent">Coming in a later phase</p>
      </div>
    </main>
  );
}
