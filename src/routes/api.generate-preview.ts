import { createFileRoute } from "@tanstack/react-router";
import { graphicSubmissionSchema } from "@/lib/generation-schema";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { generateOpenAIPreview } from "@/lib/openai-image.server";

export const Route = createFileRoute("/api/generate-preview")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const authHeader = request.headers.get("authorization");
        const accessToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

        if (!accessToken) {
          return Response.json({ error: "Missing bearer token." }, { status: 401 });
        }

        const admin = createSupabaseAdminClient();
        const {
          data: { user },
          error: userError,
        } = await admin.auth.getUser(accessToken);

        if (userError || !user) {
          return Response.json({ error: userError?.message || "Unauthorized." }, { status: 401 });
        }

        const formData = await request.formData();
        const parsed = graphicSubmissionSchema.safeParse({
          requestorInfo: formData.get("requestorInfo"),
          requestDate: formData.get("requestDate"),
          assetNeed: formData.get("assetNeed"),
          assetType: formData.get("assetType"),
          description: formData.get("description"),
          businessObjective: formData.get("businessObjective"),
          type: formData.get("type"),
          auctionName: formData.get("auctionName"),
          targetAudience: formData.get("targetAudience"),
          cta: formData.get("cta"),
          equipmentCategory: formData.get("equipmentCategory"),
          equipmentName: formData.get("equipmentName"),
          featureHighlight: formData.get("featureHighlight"),
          auctionDate: formData.get("auctionDate"),
          auctionTime: formData.get("auctionTime"),
          auctionLocation: formData.get("auctionLocation"),
          reminderMessage: formData.get("reminderMessage"),
          promotionHeadline: formData.get("promotionHeadline"),
          promotionFocus: formData.get("promotionFocus"),
        });

        if (!parsed.success) {
          return Response.json(
            { error: "Invalid submission.", details: parsed.error.flatten() },
            { status: 400 },
          );
        }

        const sourceImage = formData.get("sourceImage");

        try {
          const preview = await generateOpenAIPreview(
            parsed.data,
            parsed.data.assetType,
            sourceImage instanceof File ? sourceImage : null,
          );

          return Response.json({
            output: {
              channel: parsed.data.assetType,
              imageBase64: preview.base64,
              mimeType: preview.mimeType,
              model: preview.model,
              prompt: preview.prompt,
              size: preview.size,
            },
          });
        } catch (error) {
          return Response.json(
            {
              error:
                error instanceof Error ? error.message : "Unable to generate the OpenAI preview.",
            },
            { status: 500 },
          );
        }
      },
    },
  },
});
