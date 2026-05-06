import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  Check,
  Download,
  ImagePlus,
  Save,
  Upload,
} from "lucide-react";
import { AuctionPreview, type ChannelPreviewFormat } from "@/components/AuctionPreview";
import { useAuth } from "@/lib/auth";
import { getChannelSpec, type ChannelName } from "@/lib/channel-specs";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { renderMockPreviewFile } from "@/lib/mock-preview";
import { graphicTypes, ctaOptions, equipmentCategories } from "@/lib/mock-data";
import type { GraphicSubmission } from "@/lib/generation-schema";

export const Route = createFileRoute("/dashboard/create")({
  validateSearch: z.object({
    generationId: z.string().optional(),
  }),
  head: () => ({ meta: [{ title: "Create Graphic — JMA Marketing Studio" }] }),
  component: CreatePage,
});

const platforms = [
  "Instagram Post",
  "Threads Post",
  "Facebook Post",
  "LinkedIn Post",
  "Twitter Post",
  "YouTube Community",
] as const;

const timeOptions = [
  "12:00 AM",
  "1:00 AM",
  "2:00 AM",
  "3:00 AM",
  "4:00 AM",
  "5:00 AM",
  "6:00 AM",
  "7:00 AM",
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
  "9:00 PM",
  "10:00 PM",
  "11:00 PM",
] as const;

const steps = [
  {
    id: "brief",
    kicker: "Step 1",
    title: "Set the brief",
    description: "Pick the post type, audience, and channels so the studio knows the lane.",
  },
  {
    id: "details",
    kicker: "Step 2",
    title: "Add auction details",
    description: "Fill the must-have event information that drives the layout hierarchy.",
  },
  {
    id: "assets",
    kicker: "Step 3",
    title: "Load the asset",
    description: "Drop in the hero image and a few production notes for the design lockup.",
  },
  {
    id: "final",
    kicker: "Step 4",
    title: "Final check",
    description: "Review the finishing details before moving into channel previews and export.",
  },
] as const;

function CreatePage() {
  const { session, isConfigured } = useAuth();
  const { generationId } = Route.useSearch();
  const [stepIndex, setStepIndex] = useState(0);
  const [isReviewStage, setIsReviewStage] = useState(false);
  const [data, setData] = useState({
    type: "",
    year: "",
    title: "",
    date: "",
    time: "",
    timezone: "CT",
    location: "",
    category: "",
    cta: "",
    specs: "",
    website: "",
    phone: "",
    imageUrl: "",
    platforms: [] as string[],
  });
  const [sourceImageFile, setSourceImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isLoadingGeneration, setIsLoadingGeneration] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const currentStep = steps[stepIndex];
  const progress = ((stepIndex + 1) / steps.length) * 100;

  const set = <K extends keyof typeof data>(k: K, v: (typeof data)[K]) =>
    setData((d) => ({ ...d, [k]: v }));

  const togglePlatform = (platform: string) => {
    setData((current) => {
      const exists = current.platforms.includes(platform);
      const nextPlatforms = exists
        ? current.platforms.filter((item) => item !== platform)
        : [...current.platforms, platform];

      return { ...current, platforms: nextPlatforms };
    });
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSourceImageFile(file);
      set("imageUrl", URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (!generationId) {
      return;
    }

    let cancelled = false;

    const loadGeneration = async () => {
      setIsLoadingGeneration(true);
      setErrorMessage(null);

      try {
        const supabase = getSupabaseBrowserClient();

        if (!isConfigured || !supabase || !session?.user) {
          return;
        }

        const { data: generation, error } = await supabase
          .from("generations")
          .select("id, input_data, source_image_url, preview_image_url")
          .eq("id", generationId)
          .single();

        if (error) {
          throw error;
        }

        if (cancelled || !generation?.input_data) {
          return;
        }

        const input = generation.input_data as Record<string, unknown>;
        const exports = Array.isArray(input.channelExports)
          ? (input.channelExports as Array<{ channel?: string }>)
          : [];

        setData({
          type: String(input.type || ""),
          year: String(input.year || ""),
          title: String(input.title || ""),
          date: String(input.date || ""),
          time: String(input.time || ""),
          timezone: String(input.timezone || "CT"),
          location: String(input.location || ""),
          category: String(input.category || ""),
          cta: String(input.cta || ""),
          specs: String(input.specs || ""),
          website: String(input.website || ""),
          phone: String(input.phone || ""),
          imageUrl: String(
            input.sourceImageUrl ||
              generation.source_image_url ||
              generation.preview_image_url ||
              "",
          ),
          platforms: exports
            .map((item) => item.channel)
            .filter((channel): channel is string => Boolean(channel)),
        });
        setSourceImageFile(null);
        setStepIndex(0);
        setIsReviewStage(false);
        setStatusMessage("Loaded the last saved version into the editor.");
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(
            error instanceof Error ? error.message : "Unable to load the saved design.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoadingGeneration(false);
        }
      }
    };

    void loadGeneration();

    return () => {
      cancelled = true;
    };
  }, [generationId, isConfigured, session?.user]);

  const getSubmissionData = (): GraphicSubmission => ({
    type: data.type,
    year: data.year,
    title: data.title,
    date: data.date,
    time: data.time,
    timezone: data.timezone,
    location: data.location,
    category: data.category,
    cta: data.cta,
    specs: data.specs,
    website: data.website,
    phone: data.phone,
  });

  const generateChannelFiles = async () => {
    const submission = getSubmissionData();
    return Promise.all(
      data.platforms.map(async (channel) => ({
        channel,
        file: await renderMockPreviewFile(submission, sourceImageFile ?? data.imageUrl, channel),
      })),
    );
  };

  const checklist = useMemo(
    () => [
      { label: "Graphic type locked", done: Boolean(data.type) },
      { label: "Channels selected", done: data.platforms.length > 0 },
      {
        label: "Core auction details filled",
        done:
          data.type === "Equipment Spotlight"
            ? Boolean(data.year && data.title && data.category && data.date && data.time)
            : Boolean(data.title && data.date && data.location),
      },
      { label: "Hero image loaded", done: Boolean(sourceImageFile || data.imageUrl) },
      {
        label:
          data.type === "Equipment Spotlight" ? "Auction start line confirmed" : "CTA confirmed",
        done: data.type === "Equipment Spotlight" ? Boolean(data.timezone) : Boolean(data.cta),
      },
    ],
    [data, sourceImageFile],
  );

  const createGeneration = async () => {
    if (!isConfigured) {
      throw new Error("Supabase environment variables are not configured yet.");
    }

    if (!session?.access_token) {
      throw new Error("Log in before generating a preview.");
    }

    const body = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key !== "imageUrl" && key !== "platforms") {
        body.set(key, value);
      }
    });
    const channelFiles = await generateChannelFiles();

    if (channelFiles.length === 0) {
      throw new Error("Select at least one channel before exporting.");
    }

    body.set("previewImage", channelFiles[0].file);
    channelFiles.forEach(({ channel, file }) => {
      body.append("previewImages", file);
      body.append("previewChannels", channel);
    });
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

    return payload.generation as {
      image: string;
      exports?: Array<{ channel: string; image: string }>;
    };
  };

  const handleGenerate = async () => {
    setIsSaving(true);
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      const generation = await createGeneration();
      setStatusMessage(
        `Saved ${generation.exports?.length || data.platforms.length} channel design${
          (generation.exports?.length || data.platforms.length) === 1 ? "" : "s"
        } to My Graphics.`,
      );
      window.alert("Your design is saved successfully.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to generate preview.");
    } finally {
      setIsSaving(false);
    }
  };

  const downloadFile = (file: Blob, fileName: string) => {
    const blobUrl = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(blobUrl);
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      const files = await generateChannelFiles();
      if (files.length === 0) {
        throw new Error("Select at least one channel before downloading PNGs.");
      }
      files.forEach(({ channel, file }) => {
        const slug = channel.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        downloadFile(file, `auction-${slug}.png`);
      });
      setStatusMessage(
        `Downloaded ${files.length} channel PNG${files.length === 1 ? "" : "s"} successfully.`,
      );
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to download PNG.");
    } finally {
      setIsDownloading(false);
    }
  };

  const nextStep = () => {
    if (stepIndex === steps.length - 1) {
      setIsReviewStage(true);
      return;
    }

    setStepIndex((current) => Math.min(current + 1, steps.length - 1));
  };
  const previousStep = () => setStepIndex((current) => Math.max(current - 1, 0));

  if (isReviewStage) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="brand-kicker text-muted-foreground">Create</div>
            <h1 className="text-brand-display text-3xl">Channel review</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Review the design variations for each selected channel, then save or export from one
              place.
            </p>
          </div>
          <div className="brand-panel min-w-[18rem] p-4">
            <div className="brand-kicker text-muted-foreground">Review stage</div>
            <div className="mt-3 text-sm font-semibold text-foreground">
              Channel previews and export actions
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="brand-panel p-6">
            <div className="brand-kicker text-gold">Preview set</div>
            <h2 className="mt-2 text-brand-display text-2xl">Channel previews</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Each preview is shown on a scaled board using its real platform dimensions so you can
              judge the final composition more accurately before exporting.
            </p>

            <div className="mt-6 flex flex-wrap items-start gap-6">
              {data.platforms.length > 0 ? (
                data.platforms.map((platform) => (
                  <div key={platform} className="space-y-2">
                    <div className="space-y-1">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        {platform}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {getChannelSpec(platform as ChannelName).ratioLabel}
                      </div>
                    </div>
                    <div className="rounded-[1.6rem] border border-border bg-background/80 p-4 shadow-sm">
                      <div
                        className="overflow-hidden border border-border bg-background"
                        style={getScaledPreviewStyle(platform)}
                      >
                        <AuctionPreview data={data} format={getChannelPreviewFormat(platform)} />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">
                  Select at least one channel to review the format variations here.
                </div>
              )}
            </div>
          </div>

          <div className="brand-panel p-6">
            <div className="brand-kicker text-gold">Export</div>
            <h2 className="mt-2 text-brand-display text-2xl">Save or export</h2>
            <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="text-sm text-muted-foreground">
                Save a production-ready design now, download the PNG, or keep this ready for future
                Canva export and publishing actions.
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={handleGenerate}
                  disabled={isSaving || isLoadingGeneration}
                  className="bg-charcoal text-charcoal-foreground hover:bg-charcoal/90 uppercase tracking-[0.18em] font-bold"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? "Saving..." : "Save Design"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDownload}
                  disabled={isDownloading || isLoadingGeneration}
                  className="uppercase tracking-[0.18em] font-bold"
                >
                  <Download className="mr-2 h-4 w-4" />
                  {isDownloading ? "Downloading..." : "Download PNG"}
                </Button>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button
                variant="ghost"
                disabled
                className="uppercase tracking-[0.18em] font-bold text-muted-foreground"
              >
                <ImagePlus className="mr-2 h-4 w-4" />
                Canva export soon
              </Button>
            </div>
            {statusMessage && <p className="mt-4 text-sm text-emerald-700">{statusMessage}</p>}
            {errorMessage && <p className="mt-4 text-sm text-destructive">{errorMessage}</p>}
          </div>

          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsReviewStage(false)}
              className="uppercase tracking-[0.18em] font-bold"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to final check
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="brand-kicker text-muted-foreground">Create</div>
          <h1 className="text-brand-display text-3xl">Build the next auction graphic</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Answer a few internal brief questions first, then move straight into a production-ready
            layout with the JMA rules already baked in.
          </p>
        </div>
        <div className="brand-panel min-w-[18rem] p-4">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.22em] text-muted-foreground">
            <span>{currentStep.kicker}</span>
            <span>
              {stepIndex + 1} of {steps.length}
            </span>
          </div>
          <Progress value={progress} className="mt-3 h-2" />
          <div className="mt-3 text-sm font-semibold text-foreground">{currentStep.title}</div>
        </div>
      </div>

      {isLoadingGeneration ? (
        <div className="brand-panel p-4 text-sm text-muted-foreground">
          Loading the saved design into the editor…
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_26rem]">
        <div className="space-y-6">
          <div className="brand-panel p-6">
            <div className="flex flex-wrap gap-3">
              {steps.map((step, index) => {
                const isActive = index === stepIndex;
                const isDone = index < stepIndex;

                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setStepIndex(index)}
                    className={[
                      "questionnaire-step",
                      isActive ? "questionnaire-step-active" : "",
                      isDone ? "questionnaire-step-complete" : "",
                    ].join(" ")}
                  >
                    <span className="questionnaire-step-index">
                      {isDone ? <Check className="h-3.5 w-3.5" /> : index + 1}
                    </span>
                    <span>
                      <span className="block text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                        {step.kicker}
                      </span>
                      <span className="block text-sm font-semibold">{step.title}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 border-t border-border pt-6">
              <div className="brand-kicker text-gold">{currentStep.kicker}</div>
              <h2 className="mt-2 text-brand-display text-2xl">{currentStep.title}</h2>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                {currentStep.description}
              </p>

              <div className="mt-6">
                {stepIndex === 0 && (
                  <div className="space-y-6">
                    <div
                      className={
                        data.type === "Equipment Spotlight"
                          ? "grid gap-4 md:grid-cols-1"
                          : "grid gap-4 md:grid-cols-2"
                      }
                    >
                      <Field label="Graphic type">
                        <Select value={data.type} onValueChange={(value) => set("type", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a graphic type" />
                          </SelectTrigger>
                          <SelectContent>
                            {graphicTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                      {data.type === "Equipment Spotlight" ? null : (
                        <Field label="Equipment category">
                          <Select
                            value={data.category}
                            onValueChange={(value) => set("category", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Choose a category" />
                            </SelectTrigger>
                            <SelectContent>
                              {equipmentCategories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </Field>
                      )}
                    </div>

                    <Field label="Channels">
                      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        {platforms.map((platform) => {
                          const checked = data.platforms.includes(platform);
                          return (
                            <label
                              key={platform}
                              className={[
                                "questionnaire-choice",
                                checked ? "questionnaire-choice-active" : "",
                              ].join(" ")}
                            >
                              <div className="flex items-center gap-3">
                                <Checkbox
                                  checked={checked}
                                  onCheckedChange={() => togglePlatform(platform)}
                                />
                                <span className="text-sm font-medium">{platform}</span>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </Field>
                  </div>
                )}

                {stepIndex === 1 && (
                  <div className="space-y-6">
                    {data.type === "Equipment Spotlight" ? (
                      <>
                        <div className="grid gap-4 sm:grid-cols-[12rem_1fr]">
                          <Field label="Year">
                            <Input
                              value={data.year}
                              onChange={(e) => set("year", e.target.value)}
                              placeholder="2000"
                            />
                          </Field>
                          <Field label="Make / model">
                            <Input
                              value={data.title}
                              onChange={(e) => set("title", e.target.value)}
                              placeholder="Liebherr LTM 1300"
                            />
                          </Field>
                        </div>

                        <Field label="Equipment class">
                          <Input
                            value={data.category}
                            onChange={(e) => set("category", e.target.value)}
                            placeholder="All Terrain Crane"
                          />
                        </Field>

                        <div className="grid gap-4 sm:grid-cols-3">
                          <Field label="Auction start date">
                            <Input
                              type="date"
                              value={data.date}
                              onChange={(e) => set("date", e.target.value)}
                            />
                          </Field>
                          <Field label="Auction start time">
                            <Select value={data.time} onValueChange={(value) => set("time", value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Choose a time" />
                              </SelectTrigger>
                              <SelectContent>
                                {timeOptions.map((time) => (
                                  <SelectItem key={time} value={time}>
                                    {time}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </Field>
                          <Field label="Timezone">
                            <Select
                              value={data.timezone}
                              onValueChange={(value) => set("timezone", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Timezone" />
                              </SelectTrigger>
                              <SelectContent>
                                {["ET", "CT", "MT", "PT"].map((timezone) => (
                                  <SelectItem key={timezone} value={timezone}>
                                    {timezone}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </Field>
                        </div>

                        <div className="questionnaire-note">
                          <CalendarClock className="h-4 w-4 text-gold" />
                          <p>
                            This template uses a strict three-line top lockup: year, make/model, and
                            equipment class.
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <Field label="Auction title">
                          <Input
                            value={data.title}
                            onChange={(e) => set("title", e.target.value)}
                            placeholder="Auction title"
                          />
                        </Field>

                        <div className="grid gap-4 sm:grid-cols-3">
                          <Field label="Date">
                            <Input
                              type="date"
                              value={data.date}
                              onChange={(e) => set("date", e.target.value)}
                            />
                          </Field>
                          <Field label="Time">
                            <Select value={data.time} onValueChange={(value) => set("time", value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Choose a time" />
                              </SelectTrigger>
                              <SelectContent>
                                {timeOptions.map((time) => (
                                  <SelectItem key={time} value={time}>
                                    {time}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </Field>
                          <Field label="Location">
                            <Input
                              value={data.location}
                              onChange={(e) => set("location", e.target.value)}
                              placeholder="City, State"
                            />
                          </Field>
                        </div>

                        <div className="questionnaire-note">
                          <CalendarClock className="h-4 w-4 text-gold" />
                          <p>
                            Keep this short and field-ready. The title, date, and location are the
                            pieces that should read fast on social.
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {stepIndex === 2 && (
                  <div className="space-y-6">
                    <div>
                      <Label className="mb-2 block">Equipment image</Label>
                      <label className="questionnaire-upload">
                        <Upload className="h-6 w-6 text-muted-foreground" />
                        <div className="text-sm font-semibold">Upload the hero image</div>
                        <div className="text-xs text-muted-foreground">
                          Clean equipment cut, strong contrast, PNG or JPG up to 10MB
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleUpload}
                        />
                      </label>
                      {sourceImageFile ? (
                        <p className="mt-3 text-sm text-foreground">
                          Uploaded file: <span className="font-medium">{sourceImageFile.name}</span>
                        </p>
                      ) : (
                        <p className="mt-3 text-sm text-muted-foreground">No file uploaded yet.</p>
                      )}
                    </div>

                    {data.type === "Equipment Spotlight" ? null : (
                      <Field label="Call to action">
                        <Select value={data.cta} onValueChange={(value) => set("cta", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a call to action" />
                          </SelectTrigger>
                          <SelectContent>
                            {ctaOptions.map((cta) => (
                              <SelectItem key={cta} value={cta}>
                                {cta}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                    )}
                  </div>
                )}

                {stepIndex === 3 && (
                  <div className="space-y-6">
                    {data.type === "Equipment Spotlight" ? null : (
                      <div className="grid gap-4 md:grid-cols-2">
                        <Field label="Website">
                          <Input
                            value={data.website}
                            onChange={(e) => set("website", e.target.value)}
                            placeholder="Company website"
                          />
                        </Field>
                        <Field label="Phone">
                          <Input
                            value={data.phone}
                            onChange={(e) => set("phone", e.target.value)}
                            placeholder="Phone number"
                          />
                        </Field>
                      </div>
                    )}

                    <div className="brand-panel p-4">
                      <div className="brand-kicker text-muted-foreground">Production checklist</div>
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        {checklist.map((item) => (
                          <div key={item.label} className="flex items-center gap-3 text-sm">
                            <span
                              className={[
                                "flex h-6 w-6 items-center justify-center border text-xs",
                                item.done
                                  ? "border-gold bg-gold text-gold-foreground"
                                  : "border-border bg-background text-muted-foreground",
                              ].join(" ")}
                            >
                              {item.done ? <Check className="h-3.5 w-3.5" /> : "•"}
                            </span>
                            <span>{item.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="brand-panel p-4">
                      <div className="brand-kicker text-muted-foreground">Next step</div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Continue to the channel review page to inspect the format variations and use
                        the export actions.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={previousStep}
                  disabled={stepIndex === 0}
                  className="uppercase tracking-[0.18em] font-bold"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={nextStep}
                  className="bg-gold text-gold-foreground hover:bg-gold/90 uppercase tracking-[0.18em] font-bold"
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="brand-kicker text-muted-foreground">Live Preview · 1080×1080</div>
            <div className="text-xs text-muted-foreground">
              {data.platforms.length} channel{data.platforms.length === 1 ? "" : "s"} selected
            </div>
          </div>
          <div className="sticky top-20 space-y-4">
            <AuctionPreview data={data} />
            <div className="brand-panel p-4">
              <div className="text-sm font-semibold uppercase tracking-[0.18em]">
                Brief snapshot
              </div>
              <div className="mt-3 space-y-3 text-sm text-muted-foreground">
                <p>
                  <span className="font-semibold text-foreground">Channels:</span>{" "}
                  {data.platforms.length > 0 ? data.platforms.join(", ") : "Not selected yet"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getChannelPreviewFormat(channel: string): ChannelPreviewFormat {
  return getChannelSpec(channel as ChannelName).previewFormat;
}

function getScaledPreviewStyle(channel: string) {
  const spec = getChannelSpec(channel as ChannelName);
  const maxLongEdge = 320;
  const scale = maxLongEdge / Math.max(spec.width, spec.height);

  return {
    width: `${Math.round(spec.width * scale)}px`,
    height: `${Math.round(spec.height * scale)}px`,
  };
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
