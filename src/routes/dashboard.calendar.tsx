import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, Megaphone, SquareStack } from "lucide-react";

export const Route = createFileRoute("/dashboard/calendar")({
  head: () => ({ meta: [{ title: "Calendar — JMA Marketing Studio" }] }),
  component: CalendarPage,
});

function CalendarPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="brand-kicker text-muted-foreground">Publishing</div>
          <h1 className="text-brand-display text-3xl">Calendar</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            This will become the home for scheduled posts and grouped campaign runs. For live
            testing, it starts empty so only real content appears here.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            label: "Scheduled posts",
            value: "0",
            text: "No posts scheduled yet.",
            icon: CalendarDays,
          },
          {
            label: "Campaign runs",
            value: "0",
            text: "No grouped content runs yet.",
            icon: SquareStack,
          },
          {
            label: "Publishing queue",
            value: "Open",
            text: "Ready for your first live scheduling test.",
            icon: Megaphone,
          },
        ].map((card) => (
          <div key={card.label} className="brand-panel p-5">
            <div className="flex items-center justify-between">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">
                {card.label}
              </div>
              <card.icon className="h-4 w-4 text-gold" />
            </div>
            <div className="mt-4 text-brand-display text-2xl">{card.value}</div>
            <p className="mt-2 text-sm text-muted-foreground">{card.text}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="brand-panel p-6">
          <div className="brand-kicker text-muted-foreground">Scheduled posts</div>
          <h2 className="mt-2 text-brand-display text-2xl">Nothing on the calendar yet</h2>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground">
            Once publishing is wired into the workflow, scheduled graphics will appear here with
            their planned date, channel mix, and current status.
          </p>
        </div>

        <div className="brand-panel p-6">
          <div className="brand-kicker text-muted-foreground">Campaigns</div>
          <h2 className="mt-2 text-brand-display text-2xl">Campaign tracking starts empty</h2>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground">
            Grouped content series and campaign windows will show up here once the team starts
            planning and scheduling real posts.
          </p>
        </div>
      </div>
    </div>
  );
}
