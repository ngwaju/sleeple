import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/AppHeader";

export const Route = createFileRoute("/formula")({
  head: () => ({
    meta: [
      { title: "Formula Builder — Sleeple" },
      { name: "description", content: "Tune how each metric weighs into your Unified Sleep Score." },
      { property: "og:title", content: "Formula Builder — Sleeple" },
      { property: "og:description", content: "Tune how each metric weighs into your Unified Sleep Score." },
    ],
  }),
  component: () => <ComingSoon title="Formula Builder" text="Tune how each metric weighs into your Unified Sleep Score." />,
});
