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
          type: formData.get("type"),
          title: formData.get("title"),
          date: formData.get("date"),
          time: formData.get("time"),
          location: formData.get("location"),
          category: formData.get("category"),
          cta: formData.get("cta"),
          specs: formData.get("specs"),
          website: formData.get("website"),
          phone: formData.get("phone"),
        });

        if (!parsed.success) {
          return Response.json(
            { error: "Invalid submission.", details: parsed.error.flatten() },
            { status: 400 },
          );
        }

        const previewImage = formData.get("previewImage");
        const sourceImage = formData.get("sourceImage");

        if (!(previewImage instanceof File) || previewImage.size === 0) {
          return Response.json({ error: "Missing generated preview image." }, { status: 400 });
        }

        const account = await ensureProfileAndOrganisation(admin, user);

        const sourceUpload =
          sourceImage instanceof File && sourceImage.size > 0
            ? await uploadFileToSupabaseStorage(admin, sourceImage, {
                userId: user.id,
                kind: "source",
              })
            : null;
        const previewUpload = await uploadFileToSupabaseStorage(admin, previewImage, {
          userId: user.id,
          kind: "preview",
        });

        const sourceUploadId = sourceUpload ? crypto.randomUUID() : null;
        const previewUploadId = crypto.randomUUID();

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
          const { error } = await admin.from("uploads").insert({
            id: previewUploadId,
            user_id: user.id,
            organisation_id: account.organisationId,
            bucket: previewUpload.bucket,
            object_key: previewUpload.objectKey,
            file_url: previewUpload.fileUrl,
            file_name: previewUpload.fileName,
            content_type: previewUpload.contentType,
            size_bytes: previewUpload.sizeBytes,
            kind: "preview",
          });

          if (error) {
            return Response.json({ error: error.message }, { status: 500 });
          }
        }

        const generationId = crypto.randomUUID();
        const payload = {
          ...parsed.data,
          sourceImageUrl: sourceUpload?.fileUrl ?? null,
          previewImageUrl: previewUpload.fileUrl,
        };

        const { error: generationError } = await admin.from("generations").insert({
          id: generationId,
          user_id: user.id,
          organisation_id: account.organisationId,
          title: parsed.data.title,
          type: parsed.data.type,
          status: "completed",
          input_data: payload,
          source_upload_id: sourceUploadId,
          preview_upload_id: previewUploadId,
          source_image_url: sourceUpload?.fileUrl ?? null,
          preview_image_url: previewUpload.fileUrl,
        });

        if (generationError) {
          return Response.json({ error: generationError.message }, { status: 500 });
        }

        return Response.json({
          generation: {
            id: generationId,
            title: parsed.data.title,
            type: parsed.data.type,
            status: "completed",
            image: previewUpload.fileUrl,
            date: new Date().toISOString(),
          },
        });
      },
    },
  },
});
