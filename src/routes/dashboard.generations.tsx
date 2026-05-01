import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { generations } from "@/lib/mock-data";
import { Download, Copy } from "lucide-react";

const filters = ["All", "Public Auction", "Featured Lot", "Bid Now", "Weekly"];

export const Route = createFileRoute("/dashboard/generations")({
  head: () => ({ meta: [{ title: "My Generations — Auction Creative Studio" }] }),
  component: GenerationsPage,
});

function GenerationsPage() {
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? generations : generations.filter((g) => g.type === active);

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Library</div>
        <h1 className="text-stencil text-3xl">My Generations</h1>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-border pb-3">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-widest transition ${
              active === f ? "bg-charcoal text-charcoal-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((g) => (
          <div key={g.id} className="group overflow-hidden border border-border bg-background">
            <div className="aspect-square overflow-hidden bg-charcoal">
              <img src={g.image} alt={g.title} loading="lazy" className="h-full w-full object-cover transition group-hover:scale-105" />
            </div>
            <div className="p-4">
              <div className="text-xs uppercase tracking-widest text-gold">{g.type}</div>
              <div className="mt-1 truncate font-semibold">{g.title}</div>
              <div className="text-xs text-muted-foreground">Created {g.date}</div>
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="outline" className="flex-1"><Download className="mr-1 h-3 w-3" /> PNG</Button>
                <Button size="sm" variant="ghost" className="flex-1"><Copy className="mr-1 h-3 w-3" /> Copy</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
