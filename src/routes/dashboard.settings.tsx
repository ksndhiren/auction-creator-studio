import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/dashboard/settings")({
  head: () => ({ meta: [{ title: "Settings — Auction Creative Studio" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Account</div>
        <h1 className="text-stencil text-3xl">Settings</h1>
      </div>

      <div className="max-w-2xl space-y-6 border border-border bg-background p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label>Full name</Label><Input defaultValue="Marcus Vance" /></div>
          <div className="space-y-2"><Label>Email</Label><Input defaultValue="marcus@vance.co" /></div>
        </div>
        <div className="space-y-2"><Label>Company</Label><Input defaultValue="Vance Heavy Equipment Auctions" /></div>
        <div className="space-y-2"><Label>Time zone</Label><Input defaultValue="America/Chicago" /></div>
        <div className="flex justify-end">
          <Button className="bg-charcoal text-charcoal-foreground hover:bg-charcoal/90 uppercase tracking-wider font-bold">Save Changes</Button>
        </div>
      </div>
    </div>
  );
}
