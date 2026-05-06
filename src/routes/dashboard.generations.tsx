import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Pencil, Trash2 } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth";
import type { GenerationListItem } from "@/lib/generation-schema";

const filters = ["All", "Public Auction", "Featured Lot", "Bid Now", "Weekly Auction"];

export const Route = createFileRoute("/dashboard/generations")({
  head: () => ({ meta: [{ title: "My Graphics — JMA Marketing Studio" }] }),
  component: GenerationsPage,
});

function GenerationsPage() {
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
      "Delete this saved design from My Graphics? This cannot be undone.",
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
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="brand-kicker text-muted-foreground">Library</div>
          <h1 className="text-brand-display text-3xl">My Graphics</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Saved finished graphics live here so the team can download them again, review past work,
            and reopen the create flow for the next version.
          </p>
        </div>
        <Button
          asChild
          className="bg-charcoal text-charcoal-foreground hover:bg-charcoal/90 uppercase tracking-[0.18em] font-bold"
        >
          <Link to="/dashboard/create">Create Graphic</Link>
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-border pb-3">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActive(filter)}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-widest transition ${
              active === filter
                ? "bg-charcoal text-charcoal-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="brand-panel p-6 text-sm text-muted-foreground">Loading graphics…</div>
      ) : filtered.length === 0 ? (
        <div className="brand-panel p-6">
          <div className="text-brand-display text-2xl">No saved graphics yet</div>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Once your team saves the first real design, it will show up here for download and reuse.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((item) => (
            <div key={item.id} className="group overflow-hidden border border-border bg-background">
              <div className="aspect-square overflow-hidden bg-charcoal">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <div className="text-xs uppercase tracking-widest text-gold">{item.type}</div>
                <div className="mt-1 truncate font-semibold">{item.title}</div>
                <div className="text-xs text-muted-foreground">Created {item.date}</div>
                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => window.open(item.image, "_blank", "noopener,noreferrer")}
                  >
                    <Download className="mr-1 h-3 w-3" />
                    PNG
                  </Button>
                  <Button asChild size="sm" variant="ghost" className="flex-1">
                    <Link to="/dashboard/create" search={{ generationId: item.id }}>
                      <Pencil className="mr-1 h-3 w-3" />
                      Edit
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
