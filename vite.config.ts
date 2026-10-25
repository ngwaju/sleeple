// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";


export default defineConfig({
  vite: {
    // Only GitHub Pages uses a repository subpath. Lovable serves at the origin.
    base: process.env.DEPLOY_TARGET === "github-pages" ? "/sleeple/" : "/",
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    // Prerender all routes to static HTML for GitHub Pages hosting.
    // Account data loads in the browser after the session is available.
    pages: [
      { path: "/" },
      { path: "/devices" },
      { path: "/formula" },
      { path: "/leaderboard" },
      { path: "/social" },
      { path: "/auth" },
      { path: "/account" },
    ],
    prerender: { enabled: true, autoStaticPathsDiscovery: false },
  },
});
