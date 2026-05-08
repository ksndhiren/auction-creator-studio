import mock1 from "@/assets/auction-mockup-1.jpg";
import mock2 from "@/assets/auction-mockup-2.jpg";
import mock3 from "@/assets/auction-mockup-3.jpg";

export const mockupImages = [mock1, mock2, mock3];

export type GraphicType =
  | "Auction announcement"
  | "Featured equipment"
  | "Bid reminder"
  | "Weekly promotion";

export const graphicTypes: GraphicType[] = [
  "Auction announcement",
  "Featured equipment",
  "Bid reminder",
  "Weekly promotion",
];

export const businessObjectives = [
  "Drive registrations",
  "Increase bidding activity",
  "Promote an upcoming auction",
  "Highlight featured equipment",
  "Attract consignors",
  "Build brand awareness",
];

export const targetAudiences = [
  "Buyers",
  "Bidders",
  "Consignors",
  "Dealers",
  "Contractors",
  "General audience",
];

export const assetNeedOptions = ["Print Need", "Web Need"] as const;

export const printAssetTypes = [
  "Flyer",
  "Handout",
  "Banner",
  "Catalog",
  "Print Ad",
];

export const webAssetTypes = [
  "Social Media",
  "Email",
  "Website Ad",
];
