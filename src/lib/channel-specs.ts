import type { ChannelPreviewFormat } from "@/components/AuctionPreview";

export const channelSpecs = {
  "Instagram Post": {
    label: "Instagram Post",
    width: 1080,
    height: 1350,
    ratioLabel: "1080 × 1350 · 4:5",
    previewFormat: "portrait",
  },
  "Threads Post": {
    label: "Threads Post",
    width: 1080,
    height: 1350,
    ratioLabel: "1080 × 1350 · 4:5",
    previewFormat: "portrait",
  },
  "Facebook Post": {
    label: "Facebook Post",
    width: 1080,
    height: 1350,
    ratioLabel: "1080 × 1350 · 4:5",
    previewFormat: "portrait",
  },
  "LinkedIn Post": {
    label: "LinkedIn Post",
    width: 1200,
    height: 1200,
    ratioLabel: "1200 × 1200 · 1:1",
    previewFormat: "square",
  },
  "Twitter Post": {
    label: "Twitter Post",
    width: 1200,
    height: 1200,
    ratioLabel: "1200 × 1200 · 1:1",
    previewFormat: "square",
  },
  "YouTube Community": {
    label: "YouTube Community",
    width: 1080,
    height: 1080,
    ratioLabel: "1080 × 1080 · 1:1",
    previewFormat: "square",
  },
} as const satisfies Record<
  string,
  {
    label: string;
    width: number;
    height: number;
    ratioLabel: string;
    previewFormat: ChannelPreviewFormat;
  }
>;

export type ChannelName = keyof typeof channelSpecs;

export function getChannelSpec(channel: string) {
  return channelSpecs[channel as ChannelName] ?? channelSpecs["Instagram Post"];
}
