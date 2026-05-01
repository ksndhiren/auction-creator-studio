import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { generations } from "@/lib/mock-data";
import { Download, Copy } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth";
import type { GenerationListItem } from "@/lib/generation-schema";

const filters = ["All", "Public Auction", "Featured Lot", "Bid Now", "Weekly"];

export const Route = createFileRoute("/dashboard/generations")({
  head: () => ({ meta: [{ title: "My Generations — JMA Marketing Studio" }] }),
  component: GenerationsPage,
});

function GenerationsPage() {
  const { session, isConfigured } = useAuth();
  const [active, setActive] = useState("All");
  const [items, setItems] = useState<GenerationListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    if (!isConfigured || !supabase || !session?.user) {
      setItems(generations);
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("generations")
        .select("id, title, type, status, created_at, preview_image_url")
        .order("created_at", { ascending: false });

      if (cancelled) {
        return;
      }

      if (error) {
        console.error(error);
        setItems(generations);
      } else {
        setItems(
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

  const filtered = useMemo(
    () => (active === "All" ? items : items.filter((g) => g.type === active)),
    [active, items],
  );

  return (
    <div className="space-y-6">
      <div>
        <div className="brand-kicker text-muted-foreground">Library</div>
        <h1 className="text-brand-display text-3xl">My Generations</h1>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-border pb-3">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-widest transition ${
              active === f
                ? "bg-charcoal text-charcoal-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading && <div className="text-sm text-muted-foreground">Loading generations…</div>}
        {filtered.map((g) => (
          <div key={g.id} className="group overflow-hidden border border-border bg-background">
            <div className="aspect-square overflow-hidden bg-charcoal">
              <img
                src={g.image}
                alt={g.title}
                loading="lazy"
                className="h-full w-full object-cover transition group-hover:scale-105"
              />
            </div>
            <div className="p-4">
              <div className="text-xs uppercase tracking-widest text-gold">{g.type}</div>
              <div className="mt-1 truncate font-semibold">{g.title}</div>
              <div className="text-xs text-muted-foreground">Created {g.date}</div>
              <div className="mt-3 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => window.open(g.image, "_blank", "noopener,noreferrer")}
                >
                  <Download className="mr-1 h-3 w-3" /> PNG
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="flex-1"
                  onClick={() => navigator.clipboard.writeText(g.image)}
                >
                  <Copy className="mr-1 h-3 w-3" /> Copy
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
