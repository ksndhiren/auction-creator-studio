import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Download, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth";
import { graphicTypes } from "@/lib/mock-data";
import type { GenerationListItem } from "@/lib/generation-schema";

const filters = ["All", ...graphicTypes];

export const Route = createFileRoute("/dashboard/generations")({
  head: () => ({ meta: [{ title: "Saved Designs — Graphics Studio" }] }),
  component: SavedDesignsPage,
});

function SavedDesignsPage() {
  const { session, isConfigured } = useAuth();
  const [active, setActive] = useState("All");
  const [items, setItems] = useState<GenerationListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!isConfigured || !supabase || !session?.user) {
      setItems([]);
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
        setItems([]);
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
    () => (active === "All" ? items : items.filter((item) => item.type === active)),
    [active, items],
  );

  const handleDelete = async (id: string) => {
    const shouldDelete = window.confirm(
      "Delete this saved design? This cannot be undone.",
    );
    if (!shouldDelete) {
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      return;
    }

    setDeletingId(id);
    try {
      const { error } = await supabase.from("generations").delete().eq("id", id);
      if (error) {
        throw error;
      }
      setItems((current) => current.filter((item) => item.id !== id));
    } catch (error) {
      console.error(error);
      window.alert("Unable to delete the saved design right now.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="brand-kicker text-muted-foreground">Saved Designs</div>
          <h1 className="text-brand-display text-4xl">Your generated outputs</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Keep what works, download it again when needed, or reopen the request as the starting
            point for the next version.
          </p>
        </div>
        <Button
          asChild
          className="bg-charcoal text-charcoal-foreground hover:bg-charcoal/90 uppercase tracking-[0.18em] font-bold"
        >
          <Link to="/dashboard/create">Create</Link>
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActive(filter)}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-widest transition ${
              active === filter
                ? "bg-charcoal text-charcoal-foreground"
                : "border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="border border-border bg-secondary/20 p-6 text-sm text-muted-foreground">
          Loading saved designs…
        </div>
      ) : filtered.length === 0 ? (
        <div className="border border-border bg-secondary/20 p-6">
          <div className="text-brand-display text-2xl">No saved designs yet</div>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Run the first request through Create and the finished PNG outputs will land here.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <div key={item.id} className="overflow-hidden border border-border bg-background">
              <div className="aspect-[4/5] overflow-hidden bg-secondary">
                <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
              </div>
              <div className="space-y-3 p-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-gold">{item.type}</div>
                  <div className="mt-1 font-semibold text-foreground">{item.title}</div>
                  <div className="text-xs text-muted-foreground">Created {item.date}</div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => window.open(item.image, "_blank", "noopener,noreferrer")}
                  >
                    <Download className="mr-1 h-3.5 w-3.5" />
                    Download
                  </Button>
                  <Button asChild size="sm" variant="ghost" className="flex-1">
                    <Link to="/dashboard/create" search={{ generationId: item.id }}>
                      <RotateCcw className="mr-1 h-3.5 w-3.5" />
                      Reuse
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="px-3 text-destructive hover:text-destructive"
                    disabled={deletingId === item.id}
                    onClick={() => void handleDelete(item.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
