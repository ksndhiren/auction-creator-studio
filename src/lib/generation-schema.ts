import { z } from "zod";

export const graphicSubmissionSchema = z.object({
  type: z.string().min(1),
  year: z.string().optional().default(""),
  title: z.string().min(1),
  date: z.string().min(1),
  time: z.string().min(1),
  timezone: z.string().optional().default(""),
  location: z.string().optional().default(""),
  category: z.string().min(1),
  cta: z.string().optional().default(""),
  specs: z.string().optional().default(""),
  website: z.string().optional().default(""),
  phone: z.string().optional().default(""),
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
