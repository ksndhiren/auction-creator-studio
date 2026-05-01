import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight, PlusSquare, Image as ImageIcon, MapPin, CalendarDays } from "lucide-react";
import { generations } from "@/lib/mock-data";
import heroInspiration from "@/assets/jma-brand-inspiration.jpg";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardHome,
});

function DashboardHome() {
  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden bg-charcoal p-8 text-charcoal-foreground lg:p-10">
        <img
          src={heroInspiration}
          alt="JMA inspiration"
          className="absolute inset-0 h-full w-full object-cover opacity-14"
        />
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute inset-y-0 right-0 w-80 bg-chevron opacity-80" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="brand-kicker mb-2 text-gold">Welcome back, Marcus</div>
            <h1 className="text-brand-display text-4xl leading-tight sm:text-5xl">
              Run the next auction push with brand discipline built in.
            </h1>
            <p className="mt-3 max-w-xl text-white/70">
              Three drafts are in progress, two facilities need approved creative this week, and the
              studio is aligned to the 2025 JMA standards.
            </p>
          </div>
          <Button
            asChild
            size="lg"
            className="bg-gold text-gold-foreground hover:bg-gold/90 font-bold uppercase tracking-[0.18em]"
          >
            <Link to="/dashboard/create">
              Create New Graphic <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { l: "Graphics this month", v: "47", i: ImageIcon, sub: "+12 vs last month" },
          { l: "Active facilities", v: "8", i: MapPin, sub: "4 permanent sites, 4 event teams" },
          {
            l: "Templates in rotation",
            v: "5",
            i: PlusSquare,
            sub: "public auction, featured lot, weekly, bid now",
          },
          { l: "Upcoming sale pushes", v: "9", i: CalendarDays, sub: "next 14 days" },
        ].map((s) => (
          <div key={s.l} className="brand-panel p-5">
            <div className="flex items-center justify-between">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">{s.l}</div>
              <s.i className="h-4 w-4 text-gold" />
            </div>
            <div className="mt-3 text-brand-display text-3xl">{s.v}</div>
            <div className="text-xs text-muted-foreground">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-brand-display text-2xl">Recent Generations</h2>
            <Link
              to="/dashboard/generations"
              className="text-sm font-semibold text-foreground underline-offset-4 hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {generations.slice(0, 4).map((g) => (
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
                  <div className="text-xs text-muted-foreground">{g.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="brand-panel p-6">
          <div className="brand-kicker text-gold">Standards snapshot</div>
          <h2 className="mt-3 text-brand-display text-2xl">Live brand controls</h2>
          <div className="mt-6 space-y-5">
            {[
              ["Primary logo", "Stacked or horizontal mark only, always with clear space."],
              ["Palette", "Black, gold, and white lead. Gray and red are support colors."],
              ["Typography", "Gotham Black for headlines, Articulat for body and utility copy."],
              ["Tone", "Professional, practical, and service-first in every auction message."],
            ].map(([title, text]) => (
              <div key={title} className="border-b border-border pb-4 last:border-b-0 last:pb-0">
                <div className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground">
                  {title}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
