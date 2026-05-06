import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CalendarDays, Images, Sparkles } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth";
import type { GenerationListItem } from "@/lib/generation-schema";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardHome,
});

function DashboardHome() {
  const { session, isConfigured } = useAuth();
  const [recentGraphics, setRecentGraphics] = useState<GenerationListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    if (!isConfigured || !supabase || !session?.user) {
      setRecentGraphics([]);
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("generations")
        .select("id, title, type, status, created_at, preview_image_url")
        .order("created_at", { ascending: false })
        .limit(3);

      if (cancelled) {
        return;
      }

      if (error) {
        console.error(error);
        setRecentGraphics([]);
      } else {
        setRecentGraphics(
          (data || []).map((row) => ({
            id: row.id,
            title: row.title,
            type: row.type,
            status: row.status,
            date: new Date(row.created_at).toISOString().slice(0, 10),
            image: row.preview_image_url,
          })),
        );
      }

      setIsLoading(false);
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [isConfigured, session?.user]);

  return (
    <div className="space-y-8">
      <div className="brand-panel p-6 lg:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="brand-kicker text-gold">Dashboard</div>
            <h1 className="mt-2 text-brand-display text-4xl leading-tight">
              Build, save, and schedule auction graphics from one clean workspace.
            </h1>
            <p className="mt-3 text-muted-foreground">
              Start a new graphic when you need one, jump back into saved work, or check what is
              already lined up in the calendar.
            </p>
          </div>
          <Button
            asChild
            size="lg"
            className="bg-charcoal text-charcoal-foreground hover:bg-charcoal/90 uppercase tracking-[0.18em] font-bold"
          >
            <Link to="/dashboard/create">
              Start New Graphic
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            label: "Quick start",
            title: "Create a new post",
            text: "Run the guided questionnaire, then fine-tune in the editor.",
            icon: Sparkles,
            to: "/dashboard/create",
          },
          {
            label: "Saved work",
            title: "Open My Graphics",
            text: "Review finished graphics and download them again when needed.",
            icon: Images,
            to: "/dashboard/generations",
          },
          {
            label: "Publishing",
            title: "View Calendar",
            text: "Check scheduled posts and grouped campaign runs in one place.",
            icon: CalendarDays,
            to: "/dashboard/calendar",
          },
        ].map((item) => (
          <Link
            key={item.title}
            to={item.to}
            className="brand-panel block p-5 transition hover:-translate-y-0.5 hover:border-gold"
          >
            <div className="flex items-center justify-between">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">
                {item.label}
              </div>
              <item.icon className="h-4 w-4 text-gold" />
            </div>
            <div className="mt-4 text-brand-display text-2xl leading-tight">{item.title}</div>
            <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-brand-display text-2xl">Recent Graphics</h2>
            <Link
              to="/dashboard/generations"
              className="text-sm font-semibold text-foreground underline-offset-4 hover:underline"
            >
              View all
            </Link>
          </div>

          {isLoading ? (
            <div className="brand-panel p-6 text-sm text-muted-foreground">Loading graphics…</div>
          ) : recentGraphics.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {recentGraphics.map((generation) => (
                <div
                  key={generation.id}
                  className="overflow-hidden border border-border bg-background"
                >
                  <div className="aspect-square overflow-hidden bg-charcoal">
                    <img
                      src={generation.image}
                      alt={generation.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="text-xs uppercase tracking-widest text-gold">
                      {generation.type}
                    </div>
                    <div className="mt-1 truncate font-semibold">{generation.title}</div>
                    <div className="mt-3 text-xs text-muted-foreground">
                      Created {generation.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="brand-panel p-6">
              <div className="text-brand-display text-2xl">No graphics yet</div>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                Your saved graphics will show up here after the first live test. Start with a fresh
                post from the create flow.
              </p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="brand-panel p-6">
            <div className="brand-kicker text-muted-foreground">Calendar status</div>
            <h2 className="mt-2 text-brand-display text-2xl">No scheduled content yet</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Publishing and campaign scheduling are still empty, which makes this a clean state for
              live testing with your first real posts.
            </p>
          </div>

          <div className="brand-panel p-6">
            <div className="brand-kicker text-muted-foreground">What to test</div>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              <p>Create a graphic from a blank brief.</p>
              <p>Save the final PNG into My Graphics.</p>
              <p>Use the saved item as the starting point for your next content iteration.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
