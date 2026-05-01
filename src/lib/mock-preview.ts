import type { GraphicSubmission } from "@/lib/generation-schema";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function truncate(value: string, max: number) {
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}

async function fileToDataUrl(file: File) {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return `data:${file.type || "image/jpeg"};base64,${btoa(binary)}`;
}

async function urlToDataUrl(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Unable to load the preview image.");
  }
  const blob = await response.blob();
  return fileToDataUrl(new File([blob], "preview-image", { type: blob.type || "image/jpeg" }));
}

export function createMockPreviewSvg(data: GraphicSubmission, embeddedImageHref?: string | null) {
  return `
    <svg width="1080" height="1080" viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#131313"/>
          <stop offset="100%" stop-color="#1f1f1f"/>
        </linearGradient>
        <linearGradient id="goldFade" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#f2a900" stop-opacity="0.28"/>
          <stop offset="100%" stop-color="#f2a900" stop-opacity="0"/>
        </linearGradient>
        <clipPath id="imageClip">
          <rect x="88" y="220" width="904" height="474" rx="6" ry="6"/>
        </clipPath>
      </defs>

      <rect width="1080" height="1080" fill="url(#bg)"/>
      <rect width="1080" height="1080" fill="url(#goldFade)"/>
      <polygon points="1080,0 1080,180 790,0" fill="#f2a900" opacity="0.88"/>
      <polygon points="0,1080 0,920 210,1080" fill="#f2a900" opacity="0.55"/>

      <rect x="88" y="60" width="260" height="52" fill="#f2a900"/>
      <text x="108" y="94" fill="#111111" font-size="22" font-weight="700" letter-spacing="4">
        ${escapeXml(truncate(data.type, 22).toUpperCase())}
      </text>

      <g transform="translate(772 58)">
        <text x="0" y="28" fill="#f2a900" font-size="48" font-weight="800">JMA</text>
        <text x="0" y="58" fill="#ffffff" font-size="18" font-weight="600" letter-spacing="3">
          AUCTION GRAPHICS STUDIO
        </text>
      </g>

      <rect x="88" y="220" width="904" height="474" fill="#0f0f0f" stroke="rgba(255,255,255,0.12)"/>
      ${
        embeddedImageHref
          ? `<image href="${embeddedImageHref}" x="88" y="220" width="904" height="474" preserveAspectRatio="xMidYMid slice" clip-path="url(#imageClip)"/>`
          : `<rect x="88" y="220" width="904" height="474" fill="#202020"/>
             <text x="540" y="450" text-anchor="middle" fill="#6d6d6d" font-size="28" letter-spacing="6">EQUIPMENT IMAGE</text>`
      }

      <rect x="88" y="742" width="180" height="4" fill="#f2a900"/>
      <text x="88" y="820" fill="#ffffff" font-size="72" font-weight="800">
        ${escapeXml(truncate(data.title, 30))}
      </text>

      <text x="88" y="920" fill="#f2a900" font-size="26" font-weight="700" letter-spacing="2">
        ${escapeXml(`${data.date} · ${data.time}`)}
      </text>
      <text x="88" y="958" fill="#ffffff" font-size="24" font-weight="500">
        ${escapeXml(truncate(data.location, 38))}
      </text>
      <text x="88" y="994" fill="#9d9d9d" font-size="20" font-weight="500">
        ${escapeXml(`${data.website} · ${data.phone}`)}
      </text>

      <rect x="760" y="900" width="232" height="84" fill="#f2a900" stroke="#f2a900"/>
      <text x="876" y="950" text-anchor="middle" fill="#111111" font-size="24" font-weight="800" letter-spacing="2">
        ${escapeXml(truncate(data.cta, 18).toUpperCase())}
      </text>
    </svg>
  `;
}

export async function renderMockPreviewFile(
  data: GraphicSubmission,
  imageSource?: File | string | null,
) {
  let embeddedImageHref: string | null = null;

  if (imageSource instanceof File) {
    embeddedImageHref = await fileToDataUrl(imageSource);
  } else if (typeof imageSource === "string" && imageSource.length > 0) {
    embeddedImageHref = await urlToDataUrl(imageSource);
  }

  const svg = createMockPreviewSvg(data, embeddedImageHref);
  const svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const svgUrl = URL.createObjectURL(svgBlob);

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Unable to render the mock preview image."));
      img.src = svgUrl;
    });

    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1080;
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Unable to create preview canvas.");
    }
    context.drawImage(image, 0, 0, 1080, 1080);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((value) => {
        if (value) {
          resolve(value);
        } else {
          reject(new Error("Unable to export preview PNG."));
        }
      }, "image/png");
    });

    return new File([blob], "generated-preview.png", { type: "image/png" });
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}
