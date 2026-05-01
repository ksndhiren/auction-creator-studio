import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload } from "lucide-react";
import { ctaOptions } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/brand")({
  head: () => ({ meta: [{ title: "Brand Kit — JMA Marketing Studio" }] }),
  component: BrandKitPage,
});

function BrandKitPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="brand-kicker text-muted-foreground">Identity</div>
        <h1 className="text-brand-display text-3xl">Brand Kit</h1>
        <p className="text-muted-foreground">
          The defaults now reflect the JMA brand book so teams start from approved values instead of
          a blank slate.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <div className="brand-panel p-6">
          <Label className="mb-3 block">Logo</Label>
          <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed border-border bg-secondary/40 text-center transition hover:border-gold">
            <Upload className="h-6 w-6 text-muted-foreground" />
            <div className="text-sm font-medium">Upload approved primary mark</div>
            <div className="text-xs text-muted-foreground">
              PNG with transparency and safe clear space
            </div>
            <input type="file" accept="image/*" className="hidden" />
          </label>
        </div>

        <div className="brand-panel space-y-5 p-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <ColorField label="Primary" value="#000000" />
            <ColorField label="Secondary" value="#63666A" />
            <ColorField label="Accent" value="#F2A900" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Website">
              <Input defaultValue="jeffmartinauctioneers.com" />
            </Field>
            <Field label="Phone">
              <Input defaultValue="844.450.6200" />
            </Field>
          </div>

          <Field label="Default CTA">
            <Select defaultValue="Register to Bid">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ctaOptions.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Brand tone">
            <Textarea
              rows={3}
              defaultValue="Professional, practical, and service-first. Clear auction facts first. Gold used intentionally. No unnecessary embellishment."
            />
          </Field>

          <div className="flex justify-end">
            <Button className="bg-charcoal text-charcoal-foreground hover:bg-charcoal/90 uppercase tracking-[0.18em] font-bold">
              Save Brand Kit
            </Button>
          </div>
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

function ColorField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-2 border border-border bg-white p-2">
        <div className="h-8 w-8 border border-border" style={{ backgroundColor: value }} />
        <Input
          defaultValue={value}
          className="border-0 bg-transparent p-0 font-mono text-sm focus-visible:ring-0"
        />
      </div>
    </div>
  );
}
