import type { SupabaseClient } from "@supabase/supabase-js";

function getStorageBucketName() {
  return process.env.SUPABASE_STORAGE_BUCKET || "auction-graphics";
}

function sanitizeSegment(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function ensureBucketExists(admin: SupabaseClient, bucketName: string) {
  const { data, error } = await admin.storage.getBucket(bucketName);

  if (!error && data) {
    return;
  }

  const { error: createError } = await admin.storage.createBucket(bucketName, {
    public: true,
    fileSizeLimit: 10485760,
  });

  if (createError && !createError.message.toLowerCase().includes("already")) {
    throw new Error(`Unable to create storage bucket: ${createError.message}`);
  }
}

export async function uploadFileToSupabaseStorage(
  admin: SupabaseClient,
  file: File,
  opts: { userId: string; kind: "source" | "preview" },
) {
  const bucket = getStorageBucketName();
  await ensureBucketExists(admin, bucket);

  const extension = file.name.includes(".") ? file.name.split(".").pop() : undefined;
  const fallbackExtension = opts.kind === "preview" ? "png" : "bin";
  const objectKey = [
    opts.userId,
    opts.kind,
    `${Date.now()}-${crypto.randomUUID()}-${sanitizeSegment(file.name || opts.kind)}.${extension || fallbackExtension}`,
  ].join("/");

  const { error: uploadError } = await admin.storage.from(bucket).upload(objectKey, file, {
    contentType: file.type || "application/octet-stream",
    upsert: true,
  });

  if (uploadError) {
    throw new Error(`Unable to upload file to Supabase Storage: ${uploadError.message}`);
  }

  const {
    data: { publicUrl },
  } = admin.storage.from(bucket).getPublicUrl(objectKey);

  return {
    bucket,
    objectKey,
    fileUrl: publicUrl,
    contentType: file.type || "application/octet-stream",
    sizeBytes: file.size,
    fileName: file.name || `${opts.kind}.${fallbackExtension}`,
  };
}
