import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight, PlusSquare, TrendingUp, Image as ImageIcon, Users } from "lucide-react";
import { generations } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardHome,
});

function DashboardHome() {
  return (
    <div className="space-y-8">
      {/* Welcome card */}
      <div className="relative overflow-hidden bg-charcoal text-charcoal-foreground p-8 lg:p-10">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute -top-10 -right-10 h-40 w-72 rotate-[-25deg] bg-diagonal opacity-40" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 text-xs uppercase tracking-[0.3em] text-gold">Welcome back, Marcus</div>
            <h1 className="text-stencil text-4xl leading-tight sm:text-5xl">Let's build the next <span className="text-gold">auction post.</span></h1>
            <p className="mt-3 max-w-lg text-white/70">You have 3 drafts in progress and 2 partners waiting on graphics this week.</p>
          </div>
          <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90 font-bold uppercase tracking-wider">
            <Link to="/dashboard/create">Create New Graphic <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { l: "Graphics this month", v: "47", i: ImageIcon, sub: "+12 vs last" },
          { l: "Active partners", v: "8", i: Users, sub: "of 12 seats" },
          { l: "Templates used", v: "5", i: PlusSquare, sub: "of 6 available" },
          { l: "Engagement lift", v: "+34%", i: TrendingUp, sub: "vs baseline" },
        ].map((s) => (
          <div key={s.l} className="border border-border bg-background p-5">
            <div className="flex items-center justify-between">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">{s.l}</div>
              <s.i className="h-4 w-4 text-gold" />
            </div>
            <div className="mt-3 text-stencil text-3xl">{s.v}</div>
            <div className="text-xs text-muted-foreground">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Recent */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-stencil text-2xl">Recent Generations</h2>
          <Link to="/dashboard/generations" className="text-sm font-semibold text-foreground underline-offset-4 hover:underline">View all</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {generations.slice(0, 4).map((g) => (
            <div key={g.id} className="group overflow-hidden border border-border bg-background">
              <div className="aspect-square overflow-hidden bg-charcoal">
                <img src={g.image} alt={g.title} loading="lazy" className="h-full w-full object-cover transition group-hover:scale-105" />
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
    </div>
  );
}
