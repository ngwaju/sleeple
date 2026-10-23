import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    // The build prerenderer requests each page with a trailing slash and is
    // pinned to maxRedirects: 0, so the default "never" 307 must not fire.
    trailingSlash: "preserve",
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
