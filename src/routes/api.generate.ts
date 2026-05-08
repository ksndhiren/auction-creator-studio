import { createFileRoute } from "@tanstack/react-router";
import { graphicSubmissionSchema } from "@/lib/generation-schema";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { ensureProfileAndOrganisation } from "@/lib/account.server";
import { uploadFileToSupabaseStorage } from "@/lib/supabase-storage.server";

export const Route = createFileRoute("/api/generate")({
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

        const previewImage = formData.get("previewImage");
        const previewImages = formData.getAll("previewImages");
        const previewChannels = formData.getAll("previewChannels");
        const sourceImage = formData.get("sourceImage");

        if (!(previewImage instanceof File) || previewImage.size === 0) {
          return Response.json({ error: "Missing generated preview image." }, { status: 400 });
        }

        const channelFiles = previewImages
          .map((value, index) => ({
            file: value,
            channel: String(previewChannels[index] || ""),
          }))
          .filter(
            (item): item is { file: File; channel: string } =>
              item.file instanceof File && item.file.size > 0 && item.channel.length > 0,
          );

        if (channelFiles.length === 0) {
          return Response.json({ error: "Missing output files." }, { status: 400 });
        }

        const account = await ensureProfileAndOrganisation(admin, user);

        const sourceUpload =
          sourceImage instanceof File && sourceImage.size > 0
            ? await uploadFileToSupabaseStorage(admin, sourceImage, {
                userId: user.id,
                kind: "source",
              })
            : null;
        const sourceUploadId = sourceUpload ? crypto.randomUUID() : null;

        const previewUploads = await Promise.all(
          channelFiles.map(async ({ file, channel }) => ({
            channel,
            uploadId: crypto.randomUUID(),
            upload: await uploadFileToSupabaseStorage(admin, file, {
              userId: user.id,
              kind: "preview",
            }),
          })),
        );
        const primaryPreview = previewUploads[0];

        if (sourceUpload) {
          const { error } = await admin.from("uploads").insert({
            id: sourceUploadId,
            user_id: user.id,
            organisation_id: account.organisationId,
            bucket: sourceUpload.bucket,
            object_key: sourceUpload.objectKey,
            file_url: sourceUpload.fileUrl,
            file_name: sourceUpload.fileName,
            content_type: sourceUpload.contentType,
            size_bytes: sourceUpload.sizeBytes,
            kind: "source",
          });

          if (error) {
            return Response.json({ error: error.message }, { status: 500 });
          }
        }

        {
          const { error } = await admin.from("uploads").insert(
            previewUploads.map(({ uploadId, upload }) => ({
              id: uploadId,
              user_id: user.id,
              organisation_id: account.organisationId,
              bucket: upload.bucket,
              object_key: upload.objectKey,
              file_url: upload.fileUrl,
              file_name: upload.fileName,
              content_type: upload.contentType,
              size_bytes: upload.sizeBytes,
              kind: "preview",
            })),
          );

          if (error) {
            return Response.json({ error: error.message }, { status: 500 });
          }
        }

        const generationId = crypto.randomUUID();
        const payload = {
          ...parsed.data,
          sourceImageUrl: sourceUpload?.fileUrl ?? null,
          previewImageUrl: primaryPreview.upload.fileUrl,
          outputGroups: previewUploads.map(({ channel }) => channel),
          channelExports: previewUploads.map(({ channel, upload }) => ({
            channel,
            image: upload.fileUrl,
          })),
        };

        const { error: generationError } = await admin.from("generations").insert({
          id: generationId,
          user_id: user.id,
          organisation_id: account.organisationId,
          title: parsed.data.auctionName || parsed.data.assetType,
          type: parsed.data.type,
          status: "completed",
          input_data: payload,
          source_upload_id: sourceUploadId,
          preview_upload_id: primaryPreview.uploadId,
          source_image_url: sourceUpload?.fileUrl ?? null,
          preview_image_url: primaryPreview.upload.fileUrl,
        });

        if (generationError) {
          return Response.json({ error: generationError.message }, { status: 500 });
        }

        return Response.json({
          generation: {
            id: generationId,
            title: parsed.data.auctionName || parsed.data.assetType,
            type: parsed.data.type,
            status: "completed",
            image: primaryPreview.upload.fileUrl,
            exports: payload.channelExports,
            date: new Date().toISOString(),
          },
        });
      },
    },
  },
});
