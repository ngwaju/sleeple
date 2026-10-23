import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/AppHeader";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Leaderboard & Challenges — Sleeple" },
      { name: "description", content: "Compete with friends on fair, normalized sleep scores." },
      { property: "og:title", content: "Leaderboard & Challenges — Sleeple" },
      { property: "og:description", content: "Compete with friends on fair, normalized sleep scores." },
    ],
  }),
  component: () => <ComingSoon title="Leaderboard & Challenges" text="Compete with friends on fair, normalized sleep scores." />,
});
