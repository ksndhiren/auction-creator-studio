import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
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
import { Upload, Download, Save, Sparkles } from "lucide-react";
import { AuctionPreview } from "@/components/AuctionPreview";
import { graphicTypes, ctaOptions, equipmentCategories, mockupImages } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/dashboard/create")({
  head: () => ({ meta: [{ title: "Create Graphic — JMA Marketing Studio" }] }),
  component: CreatePage,
});

function CreatePage() {
  const { session, isConfigured } = useAuth();
  const [data, setData] = useState({
    type: "Public Auction",
    title: "Kissimmee Public Auction",
    date: "March 15, 2026",
    time: "10:00 AM",
    location: "Kissimmee, FL",
    category: "Heavy Equipment",
    cta: "Register to Bid",
    specs: "",
    website: "jeffmartinauctioneers.com",
    phone: "844.450.6200",
    imageUrl: mockupImages[0],
  });
  const [sourceImageFile, setSourceImageFile] = useState<File | null>(null);
  const [lastGeneratedUrl, setLastGeneratedUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const set = <K extends keyof typeof data>(k: K, v: (typeof data)[K]) =>
    setData((d) => ({ ...d, [k]: v }));

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setSourceImageFile(f);
      set("imageUrl", URL.createObjectURL(f));
    }
  };

  const handleGenerate = async () => {
    if (!isConfigured) {
      setErrorMessage("Add your Supabase and R2 environment variables before generating.");
      return;
    }

    if (!session?.access_token) {
      setErrorMessage("Log in before generating a preview.");
      return;
    }

    if (!previewRef.current) {
      setErrorMessage("Preview is not ready yet.");
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      const { toPng } = await import("html-to-image");
      const pngDataUrl = await toPng(previewRef.current, {
        cacheBust: true,
        pixelRatio: 1,
      });
      const previewBlob = await fetch(pngDataUrl).then((res) => res.blob());
      const previewFile = new File([previewBlob], "generated-preview.png", {
        type: "image/png",
      });

      const body = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key !== "imageUrl") {
          body.set(key, value);
        }
      });
      body.set("previewImage", previewFile);
      if (sourceImageFile) {
        body.set("sourceImage", sourceImageFile);
      }

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body,
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Unable to generate preview.");
      }

      setLastGeneratedUrl(payload.generation.image);
      setStatusMessage("Preview generated and saved to My Generations.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to generate preview.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = async () => {
    if (lastGeneratedUrl) {
      window.open(lastGeneratedUrl, "_blank", "noopener,noreferrer");
      return;
    }

    if (!previewRef.current) {
      return;
    }

    const { toPng } = await import("html-to-image");
    const pngDataUrl = await toPng(previewRef.current, {
      cacheBust: true,
      pixelRatio: 1,
    });
    const link = document.createElement("a");
    link.href = pngDataUrl;
    link.download = "auction-preview.png";
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <div className="brand-kicker text-muted-foreground">Studio</div>
          <h1 className="text-brand-display text-3xl">Create Graphic</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Use the approved JMA hierarchy: strong headline, disciplined gold accenting, and clean
            room for the primary mark.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div className="brand-panel space-y-6 p-6">
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
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {graphicTypes.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Equipment category">
              <Select value={data.category} onValueChange={(v) => set("category", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {equipmentCategories.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <Field label="Auction title">
            <Input value={data.title} onChange={(e) => set("title", e.target.value)} />
          </Field>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Date">
              <Input value={data.date} onChange={(e) => set("date", e.target.value)} />
            </Field>
            <Field label="Time">
              <Input value={data.time} onChange={(e) => set("time", e.target.value)} />
            </Field>
            <Field label="Location">
              <Input value={data.location} onChange={(e) => set("location", e.target.value)} />
            </Field>
          </div>

          <Field label="Call to action">
            <Select value={data.cta} onValueChange={(v) => set("cta", v)}>
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

          <Field label="Specs / features (optional)">
            <Textarea
              rows={3}
              value={data.specs}
              onChange={(e) => set("specs", e.target.value)}
              placeholder="Year, hours, condition, key features…"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Website">
              <Input value={data.website} onChange={(e) => set("website", e.target.value)} />
            </Field>
            <Field label="Phone">
              <Input value={data.phone} onChange={(e) => set("phone", e.target.value)} />
            </Field>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button
              onClick={handleGenerate}
              disabled={isSubmitting}
              className="bg-charcoal text-charcoal-foreground hover:bg-charcoal/90 uppercase tracking-[0.18em] font-bold"
            >
              <Sparkles className="mr-2 h-4 w-4" /> Generate Preview
            </Button>
            <Button
              variant="outline"
              onClick={handleDownload}
              className="uppercase tracking-[0.18em] font-bold"
            >
              <Download className="mr-2 h-4 w-4" /> Download PNG
            </Button>
            <Button
              variant="ghost"
              onClick={handleGenerate}
              disabled={isSubmitting}
              className="uppercase tracking-[0.18em] font-bold"
            >
              <Save className="mr-2 h-4 w-4" /> Save Design
            </Button>
          </div>
          {statusMessage && <p className="text-sm text-emerald-700">{statusMessage}</p>}
          {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="brand-kicker text-muted-foreground">Live Preview · 1080×1080</div>
            <div className="text-xs text-muted-foreground">
              Logo-safe, color-safe, typography-safe
            </div>
          </div>
          <div className="sticky top-20">
            <div ref={previewRef}>
              <AuctionPreview data={data} />
            </div>
            <div className="brand-panel mt-4 p-4">
              <div className="text-sm font-semibold uppercase tracking-[0.18em]">
                Brand reminders
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Keep the logo on clean contrast, reserve red for alerts or urgency, and use the
                tagline only when the composition has room for it.
              </p>
            </div>
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
