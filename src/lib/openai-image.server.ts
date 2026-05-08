import type { GraphicSubmission } from "@/lib/generation-schema";
import { buildOpenAIImagePrompt } from "@/lib/openai-image-prompt";

type GeneratedPreview = {
  base64: string;
  mimeType: string;
  model: string;
  prompt: string;
  size: string;
};

function getOpenAIKey() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    throw new Error("Missing required server environment variable: OPENAI_API_KEY");
  }
  return key;
}

function getOpenAIImageModel() {
  return process.env.OPENAI_IMAGE_MODEL || "gpt-image-1.5";
}

async function parseOpenAIImageResponse(response: Response) {
  const payload = await response.json();

  if (!response.ok) {
    const message =
      payload?.error?.message || payload?.error || "OpenAI image generation failed.";
    throw new Error(message);
  }

  const imageBase64 = payload?.data?.[0]?.b64_json;
  if (!imageBase64) {
    throw new Error("OpenAI did not return image data.");
  }

  return imageBase64 as string;
}

export async function generateOpenAIPreview(
  data: GraphicSubmission,
  assetType: string,
  sourceImage?: File | null,
): Promise<GeneratedPreview> {
  const { prompt, size, outputFormat, quality, background } = buildOpenAIImagePrompt(
    data,
    assetType,
  );
  const model = getOpenAIImageModel();
  const apiKey = getOpenAIKey();

  let imageBase64: string;

  if (sourceImage && sourceImage.size > 0) {
    const formData = new FormData();
    formData.set("model", model);
    formData.set("prompt", prompt);
    formData.set("size", size);
    formData.set("quality", quality);
    formData.set("background", background);
    formData.set("output_format", outputFormat);
    formData.set("image", sourceImage, sourceImage.name || "source-image.jpg");

    const response = await fetch("https://api.openai.com/v1/images/edits", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
    });

    imageBase64 = await parseOpenAIImageResponse(response);
  } else {
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        prompt,
        size,
        quality,
        background,
        output_format: outputFormat,
      }),
    });

    imageBase64 = await parseOpenAIImageResponse(response);
  }

  return {
    base64: imageBase64,
    mimeType: "image/png",
    model,
    prompt,
    size,
  };
}
