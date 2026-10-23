import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/AppHeader";

export const Route = createFileRoute("/devices")({
  head: () => ({
    meta: [
      { title: "Devices & Settings — Sleeple" },
      { name: "description", content: "Connect Fitbit, Garmin, Apple Health, Oura and Pixel Watch." },
      { property: "og:title", content: "Devices & Settings — Sleeple" },
      { property: "og:description", content: "Connect Fitbit, Garmin, Apple Health, Oura and Pixel Watch." },
    ],
  }),
  component: () => <ComingSoon title="Devices & Settings" text="Connect Fitbit, Garmin, Apple Health, Oura and Pixel Watch." />,
});
