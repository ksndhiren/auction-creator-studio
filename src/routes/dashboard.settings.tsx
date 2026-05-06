import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/dashboard/settings")({
  head: () => ({ meta: [{ title: "Settings — JMA Marketing Studio" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="brand-kicker text-muted-foreground">Workspace</div>
        <h1 className="text-brand-display text-3xl">Settings</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          This area is intentionally neutral for live testing. Fill in only the real team and
          publishing defaults you want to carry into production.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <div className="brand-panel space-y-5 p-6">
          <div>
            <div className="brand-kicker text-muted-foreground">Connected Accounts</div>
            <h2 className="mt-2 text-brand-display text-2xl">Publishing channels</h2>
          </div>

          <p className="text-sm text-muted-foreground">
            Social account connections will be added here once platform publishing is enabled for
            live workflows.
          </p>
        </div>

        <div className="brand-panel space-y-5 p-6">
          <div>
            <div className="brand-kicker text-muted-foreground">Profile</div>
            <h2 className="mt-2 text-brand-display text-2xl">Team details</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name">
              <Input placeholder="Full name" />
            </Field>
            <Field label="Email">
              <Input placeholder="Email address" />
            </Field>
          </div>

          <Field label="Company">
            <Input placeholder="Company name" />
          </Field>

          <Field label="Time zone">
            <Input placeholder="Time zone" />
          </Field>
        </div>
      </div>

      <div className="brand-panel max-w-3xl space-y-5 p-6">
        <div>
          <div className="brand-kicker text-muted-foreground">Defaults</div>
          <h2 className="mt-2 text-brand-display text-2xl">Quick-fill settings</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Default website">
            <Input placeholder="Website" />
          </Field>
          <Field label="Default phone">
            <Input placeholder="Phone number" />
          </Field>
        </div>

        <Field label="Default CTA">
          <Input placeholder="Call to action" />
        </Field>

        <div className="flex justify-end">
          <Button className="bg-charcoal text-charcoal-foreground hover:bg-charcoal/90 uppercase tracking-[0.18em] font-bold">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
