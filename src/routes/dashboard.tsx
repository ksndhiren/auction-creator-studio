import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { AuthGate, useAuth } from "@/lib/auth";
import { BrandMark } from "@/components/BrandMark";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
});

const navItems = [
  { label: "Create", to: "/dashboard/create" },
  { label: "Saved Designs", to: "/dashboard/generations" },
];

function DashboardLayout() {
  const { session, signOut } = useAuth();
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return (
    <AuthGate>
      <div className="min-h-screen bg-background text-foreground">
        <header className="border-b border-border bg-white/92 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
            <Link to="/dashboard">
              <BrandMark showTagline={false} className="origin-left scale-90" />
            </Link>
            <nav className="flex items-center gap-2">
              {navItems.map((item) => {
                const active = pathname.startsWith(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] transition ${
                      active
                        ? "bg-charcoal text-charcoal-foreground"
                        : "border border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-muted-foreground sm:block">
                {session?.user.email}
              </span>
              <button
                type="button"
                onClick={() => void signOut()}
                className="border border-border px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground transition hover:text-foreground"
              >
                Log out
              </button>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-5 py-10">
          <Outlet />
        </main>
      </div>
    </AuthGate>
  );
}
