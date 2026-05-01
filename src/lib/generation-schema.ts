import { z } from "zod";

export const graphicSubmissionSchema = z.object({
  type: z.string().min(1),
  title: z.string().min(1),
  date: z.string().min(1),
  time: z.string().min(1),
  location: z.string().min(1),
  category: z.string().min(1),
  cta: z.string().min(1),
  specs: z.string().optional().default(""),
  website: z.string().min(1),
  phone: z.string().min(1),
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
