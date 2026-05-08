import { z } from "zod";

export const graphicSubmissionSchema = z.object({
  requestorInfo: z.string().min(1),
  requestDate: z.string().min(1),
  assetNeed: z.string().min(1),
  assetType: z.string().min(1),
  description: z.string().min(1),
  businessObjective: z.string().min(1),
  type: z.string().min(1),
  auctionName: z.string().optional().default(""),
  targetAudience: z.string().min(1),
  cta: z.string().optional().default(""),
  equipmentCategory: z.string().optional().default(""),
  equipmentName: z.string().optional().default(""),
  featureHighlight: z.string().optional().default(""),
  auctionDate: z.string().optional().default(""),
  auctionTime: z.string().optional().default(""),
  auctionLocation: z.string().optional().default(""),
  reminderMessage: z.string().optional().default(""),
  promotionHeadline: z.string().optional().default(""),
  promotionFocus: z.string().optional().default(""),
});

export type GraphicSubmission = z.infer<typeof graphicSubmissionSchema>;

export type GenerationListItem = {
  id: string;
  title: string;
  type: string;
  date: string;
  image: string;
  status: string;
};
