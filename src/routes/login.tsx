import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrandMark } from "@/components/BrandMark";
import heroInspiration from "@/assets/jma-brand-inspiration.jpg";
import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Log in — JMA Marketing Studio" }] }),
  component: LoginPage,
});

function LoginPage() {
  return <AuthShell mode="login" />;
}

export function AuthShell({ mode }: { mode: "login" | "signup" }) {
  const isSignup = mode === "signup";
  const navigate = useNavigate();
  const { session, signIn, signUp, isConfigured } = useAuth();
  const [company, setCompany] = useState("Jeff Martin Auctioneers");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      void navigate({ to: "/dashboard" });
    }
  }, [navigate, session]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    setMessage(null);
    setError(null);

    try {
      if (isSignup) {
        const result = await signUp({ company, email, password });
        if (result.error) {
          setError(result.error);
        } else if (result.needsEmailConfirmation) {
          setMessage("Check your email to confirm your account, then log in.");
        } else {
          void navigate({ to: "/dashboard" });
        }
      } else {
        const result = await signIn(email, password);
        if (result.error) {
          setError(result.error);
        } else {
          void navigate({ to: "/dashboard" });
        }
      }
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-charcoal text-charcoal-foreground lg:block">
        <img
          src={heroInspiration}
          alt="JMA campaign inspiration"
          className="absolute inset-0 h-full w-full object-cover opacity-28"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.74),rgba(0,0,0,0.9))]" />
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute inset-y-0 right-0 w-72 bg-chevron opacity-90" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Link to="/">
            <BrandMark inverted showTagline={false} />
          </Link>
          <div>
            <div className="brand-rule mb-6" />
            <h2 className="text-brand-display text-5xl leading-tight">
              Built for auction marketing teams that need speed and control.
            </h2>
            <p className="mt-4 max-w-md text-white/70">
              Generate sale graphics with the approved logo treatment, the right palette, and
              consistent facility messaging.
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center bg-secondary/40 p-8">
        <div className="brand-panel w-full max-w-sm p-8">
          <div className="mb-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            {isSignup ? "Create account" : "Welcome back"}
          </div>
          <h1 className="text-brand-display text-3xl">{isSignup ? "Sign up" : "Log in"}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isSignup
              ? "Start producing JMA-ready auction graphics today."
              : "Pick up where your team left off."}
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            {isSignup && (
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  placeholder="Jeff Martin Auctioneers"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@jeffmartinauctioneers.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {!isConfigured && (
              <p className="text-sm text-destructive">
                Add the Supabase environment variables before using authentication.
              </p>
            )}
            {error && <p className="text-sm text-destructive">{error}</p>}
            {message && <p className="text-sm text-emerald-700">{message}</p>}
            <Button
              type="submit"
              disabled={pending || !isConfigured}
              className="w-full bg-charcoal text-charcoal-foreground hover:bg-charcoal/90 uppercase tracking-[0.18em] font-bold"
            >
              {pending ? "Working…" : isSignup ? "Create account" : "Log in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isSignup ? (
              <>
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-foreground underline-offset-4 hover:underline"
                >
                  Log in
                </Link>
              </>
            ) : (
              <>
                New here?{" "}
                <Link
                  to="/signup"
                  className="font-semibold text-foreground underline-offset-4 hover:underline"
                >
                  Create an account
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
