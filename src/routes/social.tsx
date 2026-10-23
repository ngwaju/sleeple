import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/AppHeader";

export const Route = createFileRoute("/social")({
  head: () => ({
    meta: [
      { title: "Chronotypes & Social — Sleeple" },
      { name: "description", content: "Discover your chronotype and see how friends sleep." },
      { property: "og:title", content: "Chronotypes & Social — Sleeple" },
      { property: "og:description", content: "Discover your chronotype and see how friends sleep." },
    ],
  }),
  component: () => <ComingSoon title="Chronotypes & Social" text="Discover your chronotype and see how friends sleep." />,
});
