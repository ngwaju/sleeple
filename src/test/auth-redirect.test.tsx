import { fireEvent, render, screen, waitFor, cleanup } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { signInWithOAuth, navigate, auth } = vi.hoisted(() => ({
  signInWithOAuth: vi.fn(),
  navigate: vi.fn(),
  auth: { user: null as null | { id: string } },
}));

vi.mock("@/integrations/lovable/index", () => ({ lovable: { auth: { signInWithOAuth } } }));
vi.mock("@/hooks/use-auth", () => ({ useAuth: () => auth }));
vi.mock("@tanstack/react-router", async (importOriginal) => ({
  ...await importOriginal<typeof import("@tanstack/react-router")>(),
  useNavigate: () => navigate,
}));

import { Route } from "@/routes/auth";

function renderSignIn() {
  const Component = Route.options.component;
  if (!Component) throw new Error("Missing sign-in page");
  return render(<Component />);
}

describe("Google sign-in return address", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    auth.user = null;
    signInWithOAuth.mockResolvedValue({ redirected: true });
  });
  afterEach(() => {
    cleanup();
    vi.unstubAllEnvs();
  });

  it("returns to the public origin root on Lovable, not the GitHub repository path", async () => {
    vi.stubEnv("BASE_URL", "/");
    renderSignIn();
    fireEvent.click(screen.getByRole("button", { name: "Continue with Google" }));
    await waitFor(() => expect(signInWithOAuth).toHaveBeenCalledWith("google", {
      redirect_uri: `${window.location.origin}/`,
    }));
    expect(navigate).not.toHaveBeenCalled();
  });

  it("keeps the repository return path for a GitHub Pages build", async () => {
    vi.stubEnv("BASE_URL", "/sleeple/");
    renderSignIn();
    fireEvent.click(screen.getByRole("button", { name: "Continue with Google" }));
    await waitFor(() => expect(signInWithOAuth).toHaveBeenCalledWith("google", {
      redirect_uri: `${window.location.origin}/sleeple/`,
    }));
  });

  it("opens the account only once an authenticated user is available", async () => {
    vi.stubEnv("BASE_URL", "/");
    const view = renderSignIn();
    expect(navigate).not.toHaveBeenCalled();
    auth.user = { id: "signed-in-user" };
    const Component = Route.options.component;
    if (!Component) throw new Error("Missing sign-in page");
    view.rerender(<Component />);
    await waitFor(() => expect(navigate).toHaveBeenCalledWith({ to: "/account" }));
  });
});