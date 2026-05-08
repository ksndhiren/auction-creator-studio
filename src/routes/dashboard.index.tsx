import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, FolderOpen, Sparkles } from "lucide-react";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardHome,
});

function DashboardHome() {
  return (
    <div className="space-y-8">
      <div className="max-w-3xl">
        <h1 className="mt-2 text-brand-display text-5xl leading-tight">
          Start a new request or jump back into saved designs.
        </h1>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Link
          to="/dashboard/create"
          className="group border border-border bg-background p-8 transition hover:border-gold hover:bg-secondary/20"
        >
          <div className="flex items-center justify-between">
            <Sparkles className="h-5 w-5 text-gold" />
            <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1" />
          </div>
          <div className="mt-8 text-brand-display text-3xl">Create</div>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Fill out the multi-step request, generate the final image outputs, then save or
            download them.
          </p>
        </Link>

        <Link
          to="/dashboard/generations"
          className="group border border-border bg-background p-8 transition hover:border-gold hover:bg-secondary/20"
        >
          <div className="flex items-center justify-between">
            <FolderOpen className="h-5 w-5 text-gold" />
            <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1" />
          </div>
          <div className="mt-8 text-brand-display text-3xl">Saved Designs</div>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            View finished outputs, download them again, or reuse a saved request as the starting
            point for the next version.
          </p>
        </Link>
      </div>
    </div>
  );
}
