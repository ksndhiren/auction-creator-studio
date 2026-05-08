export const channelSpecs = {
  Flyer: {
    label: "Flyer",
    width: 1024,
    height: 1536,
    ratioLabel: "Portrait layout · 1024 × 1536",
  },
  Handout: {
    label: "Handout",
    width: 1024,
    height: 1536,
    ratioLabel: "Portrait layout · 1024 × 1536",
  },
  Banner: {
    label: "Banner",
    width: 1536,
    height: 1024,
    ratioLabel: "Landscape layout · 1536 × 1024",
  },
  Catalog: {
    label: "Catalog",
    width: 1024,
    height: 1536,
    ratioLabel: "Portrait layout · 1024 × 1536",
  },
  "Print Ad": {
    label: "Print Ad",
    width: 1024,
    height: 1024,
    ratioLabel: "Square layout · 1024 × 1024",
  },
  "Social Media": {
    label: "Social Media",
    width: 1024,
    height: 1536,
    ratioLabel: "Portrait layout · 1024 × 1536",
  },
  Email: {
    label: "Email",
    width: 1536,
    height: 1024,
    ratioLabel: "Landscape layout · 1536 × 1024",
  },
  "Website Ad": {
    label: "Website Ad",
    width: 1536,
    height: 1024,
    ratioLabel: "Landscape layout · 1536 × 1024",
  },
} as const;

export type ChannelName = keyof typeof channelSpecs;

export function getChannelSpec(channel: string) {
  return channelSpecs[channel as ChannelName] ?? channelSpecs["Social Media"];
}
