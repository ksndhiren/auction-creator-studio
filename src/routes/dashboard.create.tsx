import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { ArrowLeft, ArrowRight, Download, ImagePlus, Save, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getChannelSpec, type ChannelName } from "@/lib/channel-specs";
import {
  assetNeedOptions,
  businessObjectives,
  graphicTypes,
  printAssetTypes,
  targetAudiences,
  webAssetTypes,
} from "@/lib/mock-data";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/dashboard/create")({
  validateSearch: z.object({
    generationId: z.string().optional(),
  }),
  head: () => ({ meta: [{ title: "Create — Graphics Studio" }] }),
  component: CreatePage,
});

const steps = [
  {
    id: "request",
    kicker: "Step 1",
    title: "Request details",
    description: "Capture who is asking, what asset family this belongs to, and when the request came in.",
  },
  {
    id: "brief",
    kicker: "Step 2",
    title: "Creative brief",
    description: "Define the purpose of the asset and the audience it needs to reach.",
  },
  {
    id: "asset",
    kicker: "Step 3",
    title: "Source image",
    description: "Upload the image the generated design should build around.",
  },
  {
    id: "review",
    kicker: "Step 4",
    title: "Review request",
    description: "Confirm the inputs before generating the final output page.",
  },
] as const;

type GeneratedOutput = {
  channel: string;
  imageUrl: string;
  ratioLabel: string;
};

type PreparedOutput = {
  channel: string;
  file: File;
};

function getTodayIso() {
  return new Date().toISOString().slice(0, 10);
}

function CreatePage() {
  const { session, isConfigured } = useAuth();
  const { generationId } = Route.useSearch();
  const [stepIndex, setStepIndex] = useState(0);
  const [isResultsStage, setIsResultsStage] = useState(false);
  const [data, setData] = useState({
    requestorInfo: "",
    requestDate: getTodayIso(),
    assetNeed: "",
    assetType: "",
    description: "",
    businessObjective: "",
    type: "",
    auctionName: "",
    targetAudience: "",
    cta: "",
    equipmentCategory: "",
    equipmentName: "",
    featureHighlight: "",
    auctionDate: "",
    auctionTime: "",
    auctionLocation: "",
    reminderMessage: "",
    promotionHeadline: "",
    promotionFocus: "",
    imageUrl: "",
  });
  const [sourceImageFile, setSourceImageFile] = useState<File | null>(null);
  const [generatedOutputs, setGeneratedOutputs] = useState<GeneratedOutput[]>([]);
  const [preparedOutputs, setPreparedOutputs] = useState<PreparedOutput[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isLoadingGeneration, setIsLoadingGeneration] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const currentStep = steps[stepIndex];
  const progress = ((stepIndex + 1) / steps.length) * 100;

  const assetTypeOptions =
    data.assetNeed === "Print Need"
      ? printAssetTypes
      : data.assetNeed === "Web Need"
        ? webAssetTypes
        : [];

  const requestSpecificComplete = (() => {
    if (data.type === "Featured equipment") {
      return Boolean(data.equipmentCategory && data.equipmentName && data.featureHighlight && data.cta);
    }
    if (data.type === "Auction announcement") {
      return Boolean(data.auctionDate && data.auctionTime && data.auctionLocation && data.cta);
    }
    if (data.type === "Bid reminder") {
      return Boolean(data.auctionDate && data.auctionTime && data.reminderMessage && data.cta);
    }
    if (data.type === "Weekly promotion") {
      return Boolean(data.promotionHeadline && data.promotionFocus && data.cta);
    }
    return false;
  })();

  const set = <K extends keyof typeof data>(key: K, value: (typeof data)[K]) => {
    setData((current) => ({ ...current, [key]: value }));
  };

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setSourceImageFile(file);
    set("imageUrl", URL.createObjectURL(file));
    setGeneratedOutputs([]);
    setPreparedOutputs([]);
    setStatusMessage(null);
    setErrorMessage(null);
  };

  const base64ToFile = (base64: string, mimeType: string, filename: string) => {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }
    return new File([bytes], filename, { type: mimeType });
  };

  const getCurrentSourceImageFile = async () => {
    if (sourceImageFile) {
      return sourceImageFile;
    }

    if (!data.imageUrl) {
      return null;
    }

    const response = await fetch(data.imageUrl);
    if (!response.ok) {
      throw new Error("Unable to load the current source image.");
    }
    const blob = await response.blob();
    return new File([blob], "source-image", { type: blob.type || "image/jpeg" });
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
          .select("title, input_data, source_image_url")
          .eq("id", generationId)
          .single();

        if (error) {
          throw error;
        }

        const input = (generation?.input_data || {}) as Record<string, unknown>;
        if (cancelled) {
          return;
        }

        setData({
          requestorInfo: String(input.requestorInfo || ""),
          requestDate: String(input.requestDate || getTodayIso()),
          assetNeed: String(input.assetNeed || ""),
          assetType: String(input.assetType || ""),
          description: String(input.description || ""),
          businessObjective: String(input.businessObjective || ""),
          type: String(input.type || ""),
          auctionName: String(input.auctionName || generation?.title || ""),
          targetAudience: String(input.targetAudience || ""),
          cta: String(input.cta || ""),
          equipmentCategory: String(input.equipmentCategory || ""),
          equipmentName: String(input.equipmentName || ""),
          featureHighlight: String(input.featureHighlight || ""),
          auctionDate: String(input.auctionDate || ""),
          auctionTime: String(input.auctionTime || ""),
          auctionLocation: String(input.auctionLocation || ""),
          reminderMessage: String(input.reminderMessage || ""),
          promotionHeadline: String(input.promotionHeadline || ""),
          promotionFocus: String(input.promotionFocus || ""),
          imageUrl: String(input.sourceImageUrl || generation?.source_image_url || ""),
        });

        const outputs = Array.isArray(input.channelExports)
          ? (input.channelExports as Array<{ channel?: string; image?: string }>)
              .filter((item): item is { channel: string; image: string } =>
                Boolean(item.channel && item.image),
              )
              .map((item) => ({
                channel: item.channel,
                imageUrl: item.image,
                ratioLabel: getChannelSpec(item.channel).ratioLabel,
              }))
          : [];

        setGeneratedOutputs(outputs);
        setPreparedOutputs([]);
        setSourceImageFile(null);
        setStepIndex(0);
        setIsResultsStage(outputs.length > 0);
        setStatusMessage("Loaded the saved request and its latest output.");
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

  const getOutputKey = () => data.assetType || data.assetNeed || "Social Media";

  const appendSubmissionToFormData = (body: FormData) => {
    body.set("requestorInfo", data.requestorInfo);
    body.set("requestDate", data.requestDate);
    body.set("assetNeed", data.assetNeed);
    body.set("assetType", data.assetType);
    body.set("description", data.description);
    body.set("businessObjective", data.businessObjective);
    body.set("type", data.type);
    body.set("auctionName", data.auctionName);
    body.set("targetAudience", data.targetAudience);
    body.set("cta", data.cta);
    body.set("equipmentCategory", data.equipmentCategory);
    body.set("equipmentName", data.equipmentName);
    body.set("featureHighlight", data.featureHighlight);
    body.set("auctionDate", data.auctionDate);
    body.set("auctionTime", data.auctionTime);
    body.set("auctionLocation", data.auctionLocation);
    body.set("reminderMessage", data.reminderMessage);
    body.set("promotionHeadline", data.promotionHeadline);
    body.set("promotionFocus", data.promotionFocus);
  };

  const getPreparedOutputFiles = async () => {
    if (preparedOutputs.length > 0) {
      return preparedOutputs;
    }

    if (generatedOutputs.length > 0) {
      const files = await Promise.all(
        generatedOutputs.map(async (output) => {
          const response = await fetch(output.imageUrl);
          if (!response.ok) {
            throw new Error("Unable to download the generated output.");
          }
          const blob = await response.blob();
          return {
            channel: output.channel,
            file: new File(
              [blob],
              `${(data.auctionName || data.assetType || "design")
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")}-${output.channel
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")}.png`,
              { type: blob.type || "image/png" },
            ),
          };
        }),
      );
      return files;
    }

    throw new Error("Generate an output before saving or downloading.");
  };

  const createGeneration = async () => {
    if (!isConfigured) {
      throw new Error("Supabase environment variables are not configured yet.");
    }

    if (!session?.access_token) {
      throw new Error("Log in before saving a design.");
    }

    const outputFiles = await getPreparedOutputFiles();
    const body = new FormData();
    appendSubmissionToFormData(body);
    body.set("previewImage", outputFiles[0].file);
    outputFiles.forEach(({ channel, file }) => {
      body.append("previewImages", file);
      body.append("previewChannels", channel);
    });
    const currentSourceImageFile = await getCurrentSourceImageFile();
    if (currentSourceImageFile) {
      body.set("sourceImage", currentSourceImageFile);
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
      throw new Error(payload.error || "Unable to save this design.");
    }

    return payload.generation as {
      exports?: Array<{ channel: string; image: string }>;
    };
  };

  const handleGenerateOutput = async () => {
    setIsGenerating(true);
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      if (!session?.access_token) {
        throw new Error("Log in before generating an output.");
      }

      const body = new FormData();
      appendSubmissionToFormData(body);
      const currentSourceImageFile = await getCurrentSourceImageFile();
      if (currentSourceImageFile) {
        body.set("sourceImage", currentSourceImageFile);
      }

      const response = await fetch("/api/generate-preview", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body,
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Unable to generate the output.");
      }

      const output = payload.output as {
        channel: string;
        imageBase64: string;
        mimeType: string;
      };
      const filename = `${(data.auctionName || data.assetType || "design")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")}-${output.channel
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")}.png`;
      const file = base64ToFile(output.imageBase64, output.mimeType, filename);

      setPreparedOutputs([{ channel: output.channel, file }]);
      setGeneratedOutputs([
        {
          channel: output.channel,
          imageUrl: URL.createObjectURL(file),
          ratioLabel: getChannelSpec(output.channel as ChannelName).ratioLabel,
        },
      ]);
      setIsResultsStage(true);
      setStatusMessage("Generated the AI output.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to generate the output.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      const generation = await createGeneration();
      setGeneratedOutputs(
        (generation.exports || []).map((item) => ({
          channel: item.channel,
          imageUrl: item.image,
          ratioLabel: getChannelSpec(item.channel).ratioLabel,
        })),
      );
      setStatusMessage("Your design is saved successfully.");
      window.alert("Your design is saved successfully.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to save the design.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      const files = await getPreparedOutputFiles();
      files.forEach(({ channel, file }) => {
        const href = URL.createObjectURL(file);
        const link = document.createElement("a");
        link.href = href;
        link.download = `${(data.auctionName || data.assetType || "design")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")}-${channel.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(href);
      });

      setStatusMessage("Downloaded the PNG output.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to download the PNG.");
    } finally {
      setIsDownloading(false);
    }
  };

  const canMoveNext = (() => {
    if (stepIndex === 0) {
      return Boolean(data.requestorInfo && data.requestDate && data.assetNeed && data.assetType);
    }
    if (stepIndex === 1) {
      return Boolean(data.description && data.businessObjective && data.type && data.targetAudience && requestSpecificComplete);
    }
    if (stepIndex === 2) {
      return Boolean(sourceImageFile || data.imageUrl);
    }
    return true;
  })();

  const nextStep = () => setStepIndex((current) => Math.min(current + 1, steps.length - 1));
  const previousStep = () => setStepIndex((current) => Math.max(current - 1, 0));

  const summaryItems = [
    { label: "Design asset request", value: data.assetNeed || "Not selected" },
    { label: "Asset type", value: data.assetType || "Not selected" },
    { label: "Description of request", value: data.description || "Not provided" },
    { label: "Business objective", value: data.businessObjective || "Not selected" },
    { label: "Type of request", value: data.type || "Not selected" },
    { label: "Auction name", value: data.auctionName || "Not applicable" },
    { label: "Target audience", value: data.targetAudience || "Not selected" },
    ...(data.type === "Featured equipment"
      ? [
          { label: "Equipment category", value: data.equipmentCategory || "Not provided" },
          { label: "Equipment name", value: data.equipmentName || "Not provided" },
          { label: "Feature highlight", value: data.featureHighlight || "Not provided" },
        ]
      : []),
    ...(data.type === "Auction announcement"
      ? [
          { label: "Auction date", value: data.auctionDate || "Not provided" },
          { label: "Auction time", value: data.auctionTime || "Not provided" },
          { label: "Auction location", value: data.auctionLocation || "Not provided" },
        ]
      : []),
    ...(data.type === "Bid reminder"
      ? [
          { label: "Auction date", value: data.auctionDate || "Not provided" },
          { label: "Auction time", value: data.auctionTime || "Not provided" },
          { label: "Reminder focus", value: data.reminderMessage || "Not provided" },
        ]
      : []),
    ...(data.type === "Weekly promotion"
      ? [
          { label: "Promotion headline", value: data.promotionHeadline || "Not provided" },
          { label: "Promotion focus", value: data.promotionFocus || "Not provided" },
        ]
      : []),
    { label: "Call to action", value: data.cta || "Not provided" },
    {
      label: "Uploaded image",
      value: sourceImageFile?.name || (data.imageUrl ? "Saved source image" : "No image uploaded"),
    },
  ];

  if (isResultsStage) {
    return (
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="brand-kicker text-muted-foreground">Create</div>
            <h1 className="text-brand-display text-4xl">Generated outputs</h1>
          </div>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setIsResultsStage(false)}
            className="uppercase tracking-[0.18em] font-bold"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to review
          </Button>
        </div>

        <div className="brand-panel p-6 sm:p-8">
          {statusMessage && <p className="mb-4 text-sm text-emerald-700">{statusMessage}</p>}
          {errorMessage && <p className="mb-4 text-sm text-destructive">{errorMessage}</p>}

          {generatedOutputs.length === 0 ? (
            <div className="border border-dashed border-border bg-secondary/20 p-6 text-sm text-muted-foreground">
              Generate the output from the review step to see it here.
            </div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">
              {generatedOutputs.map((output) => (
                <div key={output.channel} className="border border-border bg-background p-4">
                  <div className="mb-3">
                    <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      {output.channel}
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">{output.ratioLabel}</div>
                  </div>
                  <img
                    src={output.imageUrl}
                    alt={output.channel}
                    className="w-full border border-border bg-secondary object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              onClick={handleSave}
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
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="space-y-4">
        <div>
          <div className="brand-kicker text-muted-foreground">Create</div>
          <h1 className="text-brand-display text-4xl">Design request</h1>
        </div>
        <div className="brand-panel p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="brand-kicker text-gold">{currentStep.kicker}</div>
              <div className="mt-1 text-brand-display text-2xl">{currentStep.title}</div>
              <p className="mt-2 text-sm text-muted-foreground">{currentStep.description}</p>
            </div>
            <div className="min-w-28 text-right text-sm text-muted-foreground">
              {stepIndex + 1} / {steps.length}
            </div>
          </div>
          <Progress value={progress} className="mt-4 h-1.5 bg-secondary" />
        </div>
      </div>

      <div className="brand-panel p-6 sm:p-8">
        {stepIndex === 0 && (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label>Requestor information</Label>
              <Input
                value={data.requestorInfo}
                onChange={(event) => set("requestorInfo", event.target.value)}
                placeholder="Name, team, or requesting department"
              />
            </div>

            <div className="space-y-2">
              <Label>Date of request</Label>
              <Input
                type="date"
                value={data.requestDate}
                onChange={(event) => set("requestDate", event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>What kind of design asset are you requesting?</Label>
              <Select
                value={data.assetNeed}
                onValueChange={(value) => {
                  set("assetNeed", value);
                  set("assetType", "");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Print Need or Web Need" />
                </SelectTrigger>
                <SelectContent>
                  {assetNeedOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>
                {data.assetNeed === "Print Need"
                  ? "Select print type of request"
                  : data.assetNeed === "Web Need"
                    ? "Select web type of request"
                    : "Type of asset"}
              </Label>
              <Select value={data.assetType} onValueChange={(value) => set("assetType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select the specific asset type" />
                </SelectTrigger>
                <SelectContent>
                  {assetTypeOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {stepIndex === 1 && (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label>Description of request</Label>
              <Textarea
                value={data.description}
                onChange={(event) => set("description", event.target.value)}
                placeholder="Describe what the design should communicate and any important context."
                className="min-h-28"
              />
            </div>

            <div className="space-y-2">
              <Label>Business objective</Label>
              <Select
                value={data.businessObjective}
                onValueChange={(value) => set("businessObjective", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a business objective" />
                </SelectTrigger>
                <SelectContent>
                  {businessObjectives.map((objective) => (
                    <SelectItem key={objective} value={objective}>
                      {objective}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Type of request</Label>
              <Select value={data.type} onValueChange={(value) => set("type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a request type" />
                </SelectTrigger>
                <SelectContent>
                  {graphicTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Target audience</Label>
              <Select
                value={data.targetAudience}
                onValueChange={(value) => set("targetAudience", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a target audience" />
                </SelectTrigger>
                <SelectContent>
                  {targetAudiences.map((audience) => (
                    <SelectItem key={audience} value={audience}>
                      {audience}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {(data.type === "Auction announcement" || data.type === "Bid reminder") && (
              <div className="space-y-2 md:col-span-2">
                <Label>Auction name</Label>
                <Input
                  value={data.auctionName}
                  onChange={(event) => set("auctionName", event.target.value)}
                  placeholder="Example: Brooklyn Spring Equipment Auction"
                />
              </div>
            )}

            {data.type === "Featured equipment" && (
              <>
                <div className="space-y-2">
                  <Label>Equipment category</Label>
                  <Input
                    value={data.equipmentCategory}
                    onChange={(event) => set("equipmentCategory", event.target.value)}
                    placeholder="Example: Cranes, excavators, trucks"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Equipment name</Label>
                  <Input
                    value={data.equipmentName}
                    onChange={(event) => set("equipmentName", event.target.value)}
                    placeholder="Example: Liebherr LTM 1300"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Feature highlight</Label>
                  <Input
                    value={data.featureHighlight}
                    onChange={(event) => set("featureHighlight", event.target.value)}
                    placeholder="Example: All terrain crane"
                  />
                </div>
              </>
            )}

            {data.type === "Auction announcement" && (
              <>
                <div className="space-y-2">
                  <Label>Auction date</Label>
                  <Input
                    type="date"
                    value={data.auctionDate}
                    onChange={(event) => set("auctionDate", event.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Auction time</Label>
                  <Input
                    value={data.auctionTime}
                    onChange={(event) => set("auctionTime", event.target.value)}
                    placeholder="Example: 10:00 AM"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Auction location</Label>
                  <Input
                    value={data.auctionLocation}
                    onChange={(event) => set("auctionLocation", event.target.value)}
                    placeholder="Example: Brooklyn, MS"
                  />
                </div>
              </>
            )}

            {data.type === "Bid reminder" && (
              <>
                <div className="space-y-2">
                  <Label>Auction date</Label>
                  <Input
                    type="date"
                    value={data.auctionDate}
                    onChange={(event) => set("auctionDate", event.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Auction time</Label>
                  <Input
                    value={data.auctionTime}
                    onChange={(event) => set("auctionTime", event.target.value)}
                    placeholder="Example: 10:00 AM"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Reminder focus</Label>
                  <Input
                    value={data.reminderMessage}
                    onChange={(event) => set("reminderMessage", event.target.value)}
                    placeholder="Example: Last chance to register and bid"
                  />
                </div>
              </>
            )}

            {data.type === "Weekly promotion" && (
              <>
                <div className="space-y-2">
                  <Label>Promotion headline</Label>
                  <Input
                    value={data.promotionHeadline}
                    onChange={(event) => set("promotionHeadline", event.target.value)}
                    placeholder="Example: This week at Jeff Martin"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Promotion focus</Label>
                  <Input
                    value={data.promotionFocus}
                    onChange={(event) => set("promotionFocus", event.target.value)}
                    placeholder="Example: New featured lots and active bidding"
                  />
                </div>
              </>
            )}

            <div className="space-y-2 md:col-span-2">
              <Label>Call to action</Label>
              <Input
                value={data.cta}
                onChange={(event) => set("cta", event.target.value)}
                placeholder="Example: Register to bid, view inventory, bid now"
              />
            </div>
          </div>
        )}

        {stepIndex === 2 && (
          <div className="space-y-4">
            <Label className="text-base">Upload the main image</Label>
            <label className="flex min-h-64 cursor-pointer flex-col items-center justify-center gap-3 border border-dashed border-border bg-secondary/30 p-6 text-center transition hover:border-gold/60 hover:bg-secondary/50">
              <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 text-gold">
                <ImagePlus className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold text-foreground">Click to upload</div>
                <div className="text-sm text-muted-foreground">
                  Use the source image the generated design should build around.
                </div>
              </div>
            </label>
            <div className="text-sm text-muted-foreground">
              {sourceImageFile
                ? `Uploaded: ${sourceImageFile.name}`
                : data.imageUrl
                  ? "A saved source image is already attached."
                  : "No image uploaded yet."}
            </div>
          </div>
        )}

        {stepIndex === 3 && (
          <div className="space-y-8">
            <div className="grid gap-4 sm:grid-cols-2">
              {summaryItems.map((item) => (
                <div key={item.label} className="border border-border bg-secondary/30 p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {item.label}
                  </div>
                  <div className="mt-2 font-medium text-foreground">{item.value}</div>
                </div>
              ))}
            </div>

            {statusMessage && <p className="text-sm text-emerald-700">{statusMessage}</p>}
            {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}

            <Button
              onClick={handleGenerateOutput}
              disabled={isGenerating || isLoadingGeneration}
              className="bg-charcoal text-charcoal-foreground hover:bg-charcoal/90 uppercase tracking-[0.18em] font-bold"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {isGenerating ? "Generating..." : "Generate Output"}
            </Button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
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
          disabled={stepIndex === steps.length - 1 || !canMoveNext}
          className="bg-gold text-gold-foreground hover:bg-gold/90 uppercase tracking-[0.18em] font-bold"
        >
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
