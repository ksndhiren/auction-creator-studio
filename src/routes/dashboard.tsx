import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Bell, Search, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { BrandMark } from "@/components/BrandMark";
import { AuthGate, useAuth } from "@/lib/auth";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
});

function DashboardLayout() {
  const { session } = useAuth();
  const initials = session?.user.email?.slice(0, 2).toUpperCase() || "AG";

  return (
    <AuthGate>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-secondary/60">
          <AppSidebar />
          <div className="flex flex-1 flex-col">
            <header className="sticky top-0 z-30 flex min-h-16 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur">
              <SidebarTrigger />
              <div className="ml-2 hidden items-center gap-3 lg:flex">
                <BrandMark compact showTagline={false} className="scale-[0.82] origin-left" />
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                <span className="brand-kicker text-muted-foreground">Marketing Studio</span>
              </div>
              <div className="relative hidden max-w-md flex-1 md:block">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search graphics, templates, facilities…"
                  className="border-0 bg-secondary pl-9 shadow-none"
                />
              </div>
              <div className="ml-auto flex items-center gap-3">
                <button className="flex h-9 w-9 items-center justify-center border border-border bg-background hover:bg-secondary">
                  <Bell className="h-4 w-4" />
                </button>
                <div className="flex h-9 w-9 items-center justify-center bg-charcoal text-gold font-display text-sm">
                  {initials}
                </div>
              </div>
            </header>
            <main className="flex-1 p-6 lg:p-8">
              <Outlet />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </AuthGate>
  );
}
