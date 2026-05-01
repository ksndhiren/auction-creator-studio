import { createFileRoute, Link } from "@tanstack/react-router";
import { Gavel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Log in — Auction Creative Studio" }] }),
  component: LoginPage,
});

function LoginPage() {
  return <AuthShell mode="login" />;
}

export function AuthShell({ mode }: { mode: "login" | "signup" }) {
  const isSignup = mode === "signup";
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-charcoal text-charcoal-foreground lg:block">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute -bottom-16 -right-16 h-72 w-[36rem] rotate-[-25deg] bg-diagonal opacity-40" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center bg-gold text-gold-foreground">
              <Gavel className="h-5 w-5" strokeWidth={2.5} />
            </div>
            <span className="font-display uppercase tracking-wider">Auction Creative Studio</span>
          </Link>
          <div>
            <div className="h-1 w-12 bg-gold mb-6" />
            <h2 className="text-stencil text-5xl leading-tight">Built for auction <span className="text-gold">marketing teams.</span></h2>
            <p className="mt-4 max-w-md text-white/70">Generate, brand and ship social posts in minutes — not hours.</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="mb-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">{isSignup ? "Create account" : "Welcome back"}</div>
          <h1 className="text-stencil text-3xl">{isSignup ? "Sign up" : "Log in"}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isSignup ? "Start creating branded auction graphics today." : "Pick up where you left off."}
          </p>

          <form className="mt-8 space-y-5" onSubmit={(e) => e.preventDefault()}>
            {isSignup && (
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input id="company" placeholder="Acme Auctions" />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@company.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" />
            </div>
            <Button asChild type="submit" className="w-full bg-charcoal text-charcoal-foreground hover:bg-charcoal/90 uppercase tracking-wider font-bold">
              <Link to="/dashboard">{isSignup ? "Create account" : "Log in"}</Link>
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isSignup ? (
              <>Already have an account? <Link to="/login" className="font-semibold text-foreground underline-offset-4 hover:underline">Log in</Link></>
            ) : (
              <>New here? <Link to="/signup" className="font-semibold text-foreground underline-offset-4 hover:underline">Create an account</Link></>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
