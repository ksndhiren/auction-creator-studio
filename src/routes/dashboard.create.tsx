import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Download, Save, Sparkles } from "lucide-react";
import { AuctionPreview } from "@/components/AuctionPreview";
import { graphicTypes, ctaOptions, equipmentCategories, mockupImages } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/create")({
  head: () => ({ meta: [{ title: "Create Graphic — Auction Creative Studio" }] }),
  component: CreatePage,
});

function CreatePage() {
  const [data, setData] = useState({
    type: "Public Auction",
    title: "Spring Equipment Auction",
    date: "March 15, 2026",
    time: "10:00 AM",
    location: "Houston, TX",
    category: "Heavy Equipment",
    cta: "Register to Bid",
    specs: "",
    website: "auctioncreative.co",
    phone: "555-200-4400",
    imageUrl: mockupImages[0],
  });

  const set = <K extends keyof typeof data>(k: K, v: (typeof data)[K]) => setData((d) => ({ ...d, [k]: v }));

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) set("imageUrl", URL.createObjectURL(f));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Studio</div>
          <h1 className="text-stencil text-3xl">Create Graphic</h1>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        {/* Form */}
        <div className="space-y-6 border border-border bg-background p-6">
          {/* Upload */}
          <div>
            <Label className="mb-2 block">Equipment image</Label>
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed border-border bg-secondary/40 p-8 text-center transition hover:border-gold hover:bg-gold/5">
              <Upload className="h-6 w-6 text-muted-foreground" />
              <div className="text-sm font-medium">Click to upload or drag and drop</div>
              <div className="text-xs text-muted-foreground">PNG, JPG up to 10MB</div>
              <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Graphic type">
              <Select value={data.type} onValueChange={(v) => set("type", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {graphicTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Equipment category">
              <Select value={data.category} onValueChange={(v) => set("category", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {equipmentCategories.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <Field label="Auction title">
            <Input value={data.title} onChange={(e) => set("title", e.target.value)} />
          </Field>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Date"><Input value={data.date} onChange={(e) => set("date", e.target.value)} /></Field>
            <Field label="Time"><Input value={data.time} onChange={(e) => set("time", e.target.value)} /></Field>
            <Field label="Location"><Input value={data.location} onChange={(e) => set("location", e.target.value)} /></Field>
          </div>

          <Field label="Call to action">
            <Select value={data.cta} onValueChange={(v) => set("cta", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {ctaOptions.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Specs / features (optional)">
            <Textarea rows={3} value={data.specs} onChange={(e) => set("specs", e.target.value)} placeholder="Year, hours, condition, key features…" />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Website"><Input value={data.website} onChange={(e) => set("website", e.target.value)} /></Field>
            <Field label="Phone"><Input value={data.phone} onChange={(e) => set("phone", e.target.value)} /></Field>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button className="bg-charcoal text-charcoal-foreground hover:bg-charcoal/90 uppercase tracking-wider font-bold">
              <Sparkles className="mr-2 h-4 w-4" /> Generate Preview
            </Button>
            <Button variant="outline" className="uppercase tracking-wider font-bold">
              <Download className="mr-2 h-4 w-4" /> Download PNG
            </Button>
            <Button variant="ghost" className="uppercase tracking-wider font-bold">
              <Save className="mr-2 h-4 w-4" /> Save Design
            </Button>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-3">
          <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Live Preview · 1080×1080</div>
          <div className="sticky top-20">
            <AuctionPreview data={data} />
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
