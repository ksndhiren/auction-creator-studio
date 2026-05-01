import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload } from "lucide-react";
import { ctaOptions } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/brand")({
  head: () => ({ meta: [{ title: "Brand Kit — Auction Creative Studio" }] }),
  component: BrandKitPage,
});

function BrandKitPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Identity</div>
        <h1 className="text-stencil text-3xl">Brand Kit</h1>
        <p className="text-muted-foreground">Lock your brand into every generated graphic.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        {/* Logo upload */}
        <div className="border border-border bg-background p-6">
          <Label className="mb-3 block">Logo</Label>
          <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed border-border bg-secondary/40 text-center transition hover:border-gold">
            <Upload className="h-6 w-6 text-muted-foreground" />
            <div className="text-sm font-medium">Upload logo</div>
            <div className="text-xs text-muted-foreground">PNG with transparency</div>
            <input type="file" accept="image/*" className="hidden" />
          </label>
        </div>

        {/* Fields */}
        <div className="space-y-5 border border-border bg-background p-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <ColorField label="Primary" value="#0F0F10" />
            <ColorField label="Secondary" value="#1F1F22" />
            <ColorField label="Accent" value="#F5C518" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Website"><Input defaultValue="auctioncreative.co" /></Field>
            <Field label="Phone"><Input defaultValue="555-200-4400" /></Field>
          </div>

          <Field label="Default CTA">
            <Select defaultValue="Register to Bid">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {ctaOptions.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Brand tone">
            <Textarea rows={3} defaultValue="Bold, industrial, trustworthy. Direct language. No fluff." />
          </Field>

          <div className="flex justify-end">
            <Button className="bg-charcoal text-charcoal-foreground hover:bg-charcoal/90 uppercase tracking-wider font-bold">
              Save Brand Kit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-2"><Label>{label}</Label>{children}</div>;
}

function ColorField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-2 border border-border p-2">
        <div className="h-8 w-8 border border-border" style={{ backgroundColor: value }} />
        <Input defaultValue={value} className="border-0 bg-transparent p-0 font-mono text-sm focus-visible:ring-0" />
      </div>
    </div>
  );
}
