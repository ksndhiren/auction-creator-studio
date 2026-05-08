import { getChannelSpec } from "@/lib/channel-specs";
import type { GraphicSubmission } from "@/lib/generation-schema";

function clean(value: string | undefined) {
  return value?.trim() || "";
}

function bullet(label: string, value: string | undefined) {
  const normalized = clean(value);
  return normalized ? `- ${label}: ${normalized}` : null;
}

function joinLines(lines: Array<string | null | undefined>) {
  return lines.filter(Boolean).join("\n");
}

function getRequestSpecificLines(data: GraphicSubmission) {
  switch (data.type) {
    case "Featured equipment":
      return joinLines([
        bullet("Equipment category", data.equipmentCategory),
        bullet("Equipment name", data.equipmentName),
        bullet("Feature highlight", data.featureHighlight),
        bullet("Call to action", data.cta),
      ]);
    case "Auction announcement":
      return joinLines([
        bullet("Auction name", data.auctionName),
        bullet("Auction date", data.auctionDate),
        bullet("Auction time", data.auctionTime),
        bullet("Auction location", data.auctionLocation),
        bullet("Call to action", data.cta),
      ]);
    case "Bid reminder":
      return joinLines([
        bullet("Auction name", data.auctionName),
        bullet("Auction date", data.auctionDate),
        bullet("Auction time", data.auctionTime),
        bullet("Reminder focus", data.reminderMessage),
        bullet("Call to action", data.cta),
      ]);
    case "Weekly promotion":
      return joinLines([
        bullet("Promotion headline", data.promotionHeadline),
        bullet("Promotion focus", data.promotionFocus),
        bullet("Call to action", data.cta),
      ]);
    default:
      return "";
  }
}

function getTypeDirection(data: GraphicSubmission) {
  switch (data.type) {
    case "Featured equipment":
      return [
        "Create a premium featured-equipment marketing graphic.",
        "The hero image and equipment should dominate the composition.",
        "Make the equipment name and feature highlight the main text hierarchy.",
      ].join(" ");
    case "Auction announcement":
      return [
        "Create a strong event-announcement graphic for an upcoming auction.",
        "Make the auction name the primary headline with date, time, and location clearly readable.",
        "The design should feel bold, urgent, and high-contrast.",
      ].join(" ");
    case "Bid reminder":
      return [
        "Create an urgency-first reminder graphic for active bidding.",
        "Emphasize the countdown feel, the reminder message, and the call to action.",
        "The layout should feel immediate and action-driven.",
      ].join(" ");
    case "Weekly promotion":
      return [
        "Create a campaign-style weekly promotion graphic.",
        "The promotion headline should lead, followed by the promotional focus and CTA.",
        "The composition can feel more editorial and dynamic than the event-driven templates.",
      ].join(" ");
    default:
      return "Create a high-quality marketing graphic.";
  }
}

export function buildOpenAIImagePrompt(data: GraphicSubmission, assetType: string) {
  const spec = getChannelSpec(assetType || data.assetType || "Social Media");
  const size = `${spec.width}x${spec.height}`;
  const requestSpecificLines = getRequestSpecificLines(data);

  const prompt = [
    "Design a finished marketing graphic for Jeff Martin Auctioneers.",
    getTypeDirection(data),
    "",
    "Brand rules that must be followed:",
    "- Use only a Jeff Martin Auctioneers color system: dominant black, Pantone 130 C-style golden yellow, and white.",
    "- Use bold, clean industrial sans-serif typography inspired by Gotham and Articulat CF.",
    "- Keep the composition polished, premium, and legible.",
    "- Reserve a clean dark safe area in the top-right corner for a logo overlay. Do not place important text or subject matter there.",
    "- Do not draw a logo in the image. Leave space for the app to place it later.",
    "- Prioritize readability and hierarchy over decorative clutter.",
    "- The design may explore different image treatments, text energy, and composition styles as long as the brand colors remain consistent.",
    "",
    `Output target: ${assetType || data.assetType} at ${size}.`,
    data.assetNeed ? `Asset family: ${data.assetNeed}.` : null,
    data.description ? `Creative description: ${data.description}` : null,
    data.businessObjective ? `Business objective: ${data.businessObjective}` : null,
    data.targetAudience ? `Target audience: ${data.targetAudience}` : null,
    "",
    "Text and content inputs to include:",
    requestSpecificLines || "- Use the provided description and objective to build the copy hierarchy.",
    "",
    "Output requirements:",
    "- Return one complete, production-ready graphic.",
    "- Include the supplied text naturally in the design.",
    "- Maintain strong contrast and clean spacing.",
    "- Avoid adding extra brand colors beyond black, golden yellow, and white.",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    prompt,
    size,
    outputFormat: "png" as const,
    quality: "high" as const,
    background: "opaque" as const,
  };
}
