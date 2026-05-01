import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { templates } from "@/lib/mock-data";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/dashboard/templates")({
  head: () => ({ meta: [{ title: "Templates — JMA Marketing Studio" }] }),
  component: TemplatesPage,
});

function TemplatesPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="brand-kicker text-muted-foreground">Library</div>
        <h1 className="text-brand-display text-3xl">Templates</h1>
        <p className="text-muted-foreground">
          Prebuilt for JMA campaign types, with the proper hierarchy already baked in.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((t) => (
          <div
            key={t.id}
            className="group flex flex-col overflow-hidden border border-border bg-background transition hover:border-gold"
          >
            <div className="aspect-square overflow-hidden bg-charcoal">
              <img
                src={t.image}
                alt={t.name}
                loading="lazy"
                className="h-full w-full object-cover transition group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col p-5">
              <div className="text-xs uppercase tracking-widest text-gold">{t.type}</div>
              <h3 className="mt-1 text-brand-display text-xl">{t.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
              <Button
                asChild
                className="mt-4 w-full bg-charcoal text-charcoal-foreground hover:bg-charcoal/90 uppercase tracking-[0.18em] font-bold"
              >
                <Link to="/dashboard/create">
                  Use Template <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
