import { getChannelSpec } from "@/lib/channel-specs";
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

function formatAuctionStarts(date: string, time: string, timezone?: string) {
  if (!date && !time) {
    return "WEDNESDAY, MAY 13TH @ 10:00 AM CT";
  }

  const [yearValue, monthValue, dayValue] = date.split("-").map(Number);
  const parsedDate =
    yearValue && monthValue && dayValue
      ? new Date(Date.UTC(yearValue, monthValue - 1, dayValue))
      : null;

  const weekday = parsedDate
    ? parsedDate.toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" }).toUpperCase()
    : "DATE";
  const month = parsedDate
    ? parsedDate.toLocaleDateString("en-US", { month: "long", timeZone: "UTC" }).toUpperCase()
    : "MONTH";
  const day = parsedDate ? parsedDate.getUTCDate() : 0;
  const suffix =
    day % 10 === 1 && day % 100 !== 11
      ? "ST"
      : day % 10 === 2 && day % 100 !== 12
        ? "ND"
        : day % 10 === 3 && day % 100 !== 13
          ? "RD"
          : "TH";

  return `${weekday}, ${month} ${day || "--"}${day ? suffix : ""} @ ${(
    time || "TIME"
  ).toUpperCase()} ${timezone || "CT"}`.trim();
}

function wrapTitle(value: string, maxCharsPerLine: number, maxLines: number) {
  const words = value.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return [];
  }

  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;

    if (nextLine.length <= maxCharsPerLine) {
      currentLine = nextLine;
      continue;
    }

    if (currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      lines.push(truncate(word, maxCharsPerLine));
      currentLine = "";
    }

    if (lines.length === maxLines) {
      break;
    }
  }

  if (lines.length < maxLines && currentLine) {
    lines.push(currentLine);
  }

  if (lines.length > maxLines) {
    lines.length = maxLines;
  }

  if (words.join(" ").length > lines.join(" ").length) {
    lines[lines.length - 1] = truncate(lines[lines.length - 1], maxCharsPerLine - 1);
  }

  return lines;
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

function createPublicAuctionSvg(
  data: GraphicSubmission,
  embeddedImageHref: string | null,
  width: number,
  height: number,
) {
  const shortEdge = Math.min(width, height);
  const titleLines = wrapTitle(
    data.title || "Auction Title Here",
    width > height ? 26 : 22,
    width > height ? 2 : 3,
  );
  const titleMarkup = titleLines
    .map(
      (line, index) =>
        `<tspan x="${width * 0.0407}" dy="${index === 0 ? 0 : shortEdge * 0.0685}">${escapeXml(line)}</tspan>`,
    )
    .join("");

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="auctionFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#000000" stop-opacity="0.12"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0.78"/>
        </linearGradient>
        <clipPath id="auctionImageClip">
          <rect x="0" y="${height * 0.0815}" width="${width}" height="${height * 0.7222}"/>
        </clipPath>
      </defs>

      <rect width="${width}" height="${height}" fill="#090909"/>
      <circle cx="${width * 0.1222}" cy="${height * 0.1167}" r="${shortEdge * 0.2222}" fill="#f2a900" fill-opacity="0.16"/>
      <polygon points="${width * 0.8241},0 ${width},0 ${width},${height} ${width * 0.6704},${height}" fill="#f2a900"/>
      <polygon points="${width * 0.7537},0 ${width * 0.887},0 ${width * 0.6389},${height} ${width * 0.5056},${height}" fill="#ffffff" fill-opacity="0.14"/>

      ${
        embeddedImageHref
          ? `<image href="${embeddedImageHref}" x="0" y="${height * 0.0815}" width="${width}" height="${height * 0.7222}" preserveAspectRatio="xMidYMid slice" clip-path="url(#auctionImageClip)"/>`
          : `<rect x="0" y="${height * 0.0815}" width="${width}" height="${height * 0.7222}" fill="#151515"/>
             <text x="${width / 2}" y="${height * 0.435}" text-anchor="middle" fill="#6d6d6d" font-size="${shortEdge * 0.026}" letter-spacing="6">EQUIPMENT IMAGE</text>`
      }
      <rect x="0" y="${height * 0.0815}" width="${width}" height="${height * 0.7222}" fill="url(#auctionFade)"/>

      <rect x="0" y="0" width="${width}" height="${height * 0.0815}" fill="#000000" fill-opacity="0.62"/>
      <rect x="${width * 0.0352}" y="${height * 0.0204}" width="${width * 0.2463}" height="${height * 0.0389}" fill="#f2a900"/>
      <text x="${width * 0.0519}" y="${height * 0.0463}" fill="#111111" font-size="${shortEdge * 0.0185}" font-weight="800" letter-spacing="4">
        ${escapeXml(truncate((data.type || "Graphic Type").toUpperCase(), 24))}
      </text>

      <text x="${width * 0.75}" y="${height * 0.037}" fill="#f2a900" font-size="${shortEdge * 0.039}" font-weight="800">JMA</text>
      <text x="${width * 0.75}" y="${height * 0.0611}" fill="#ffffff" font-size="${shortEdge * 0.013}" font-weight="700" letter-spacing="3">
        AUCTION GRAPHICS STUDIO
      </text>

      <rect x="0" y="${height * 0.6315}" width="${width * 0.687}" height="${height * 0.1574}" fill="#000000" fill-opacity="0.78"/>
      <rect x="${width * 0.0407}" y="${height * 0.6611}" width="${width * 0.0907}" height="${Math.max(4, shortEdge * 0.0046)}" fill="#f2a900"/>
      <text x="${width * 0.0407}" y="${height * 0.7278}" fill="#ffffff" font-size="${shortEdge * 0.063}" font-weight="800">
        ${titleMarkup}
      </text>

      <rect x="0" y="${height * 0.8037}" width="${width}" height="${height * 0.1963}" fill="#101010"/>
      <text x="${width * 0.0407}" y="${height * 0.8667}" fill="#f2a900" font-size="${shortEdge * 0.0222}" font-weight="800" letter-spacing="2">
        ${escapeXml(`${data.date || "Date"} · ${data.time || "Time"}`)}
      </text>
      <text x="${width * 0.0407}" y="${height * 0.9}" fill="#ffffff" font-size="${shortEdge * 0.0204}" font-weight="500">
        ${escapeXml(truncate(data.location || "Location", 36))}
      </text>
      <text x="${width * 0.0407}" y="${height * 0.9352}" fill="#9d9d9d" font-size="${shortEdge * 0.0176}" font-weight="500">
        ${escapeXml(`${data.website || "Website"} · ${data.phone || "Phone"}`)}
      </text>

      <rect x="${width * 0.7444}" y="${height * 0.8037}" width="${width * 0.2556}" height="${height * 0.1963}" fill="#f2a900"/>
      <text x="${width * 0.8722}" y="${height * 0.9111}" text-anchor="middle" fill="#111111" font-size="${shortEdge * 0.0222}" font-weight="800" letter-spacing="2">
        ${escapeXml(truncate((data.cta || "Call To Action").toUpperCase(), 18))}
      </text>
    </svg>
  `;
}

function createEquipmentSpotlightSvg(
  data: GraphicSubmission,
  embeddedImageHref: string | null,
  width: number,
  height: number,
) {
  const startsLine = formatAuctionStarts(data.date, data.time, data.timezone);

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="spotlightImageClip">
          <rect x="0" y="${height * 0.2805}" width="${width}" height="${height * 0.564}"/>
        </clipPath>
      </defs>

      <rect width="${width}" height="${height}" fill="#0a0a0a"/>
      <rect x="0" y="0" width="${width}" height="${height * 0.2755}" fill="#f2b000"/>
      <rect x="${width * 0.599}" y="0" width="${width * 0.401}" height="${height * 0.2755}" fill="#000000"/>
      <polygon points="${width * 0.5885},${height * 0.1377} ${width * 0.702},0 ${width * 0.702},${height * 0.2755}" fill="#f2b000"/>
      <rect x="0" y="${height * 0.2755}" width="${width}" height="${Math.max(3, height * 0.0052)}" fill="#050505"/>

      <text x="${width * 0.0465}" y="${height * 0.1065}" fill="#000000" font-size="${width * 0.117}" font-weight="900" letter-spacing="-3.9">
        ${escapeXml(data.year || "2000")}
      </text>
      <text x="${width * 0.0465}" y="${height * 0.1845}" fill="#000000" font-size="${width * 0.0522}" font-weight="900" letter-spacing="-2">
        ${escapeXml(truncate((data.title || "LIEBHERR LTM 1300").toUpperCase(), 26))}
      </text>
      <text x="${width * 0.0465}" y="${height * 0.2365}" fill="#ffffff" font-size="${width * 0.038}" font-weight="800">
        ${escapeXml(truncate((data.category || "ALL TERRAIN CRANE").toUpperCase(), 24))}
      </text>

      <text x="${width * 0.766}" y="${height * 0.0995}" fill="#f2b000" font-size="${width * 0.096}" font-weight="900">JMA</text>
      <text x="${width * 0.731}" y="${height * 0.1835}" fill="#ffffff" font-size="${width * 0.0322}" font-weight="900">
        JEFF MARTIN
      </text>
      <text x="${width * 0.779}" y="${height * 0.2235}" fill="#f2b000" font-size="${width * 0.0185}" font-weight="700" letter-spacing="2">
        AUCTIONEERS
      </text>

      ${
        embeddedImageHref
          ? `<image href="${embeddedImageHref}" x="0" y="${height * 0.2805}" width="${width}" height="${height * 0.564}" preserveAspectRatio="xMidYMid slice" clip-path="url(#spotlightImageClip)"/>`
          : `<rect x="0" y="${height * 0.2805}" width="${width}" height="${height * 0.564}" fill="#151515"/>
             <text x="${width / 2}" y="${height * 0.56}" text-anchor="middle" fill="#6d6d6d" font-size="${width * 0.03}" letter-spacing="6">EQUIPMENT IMAGE</text>`
      }

      <rect x="0" y="${height * 0.8445}" width="${width}" height="${height * 0.1555}" fill="#000000"/>
      <polygon points="0,${height * 0.8445} ${width * 0.0615},${height * 0.9225} 0,${height}" fill="#f2b000"/>
      <rect x="0" y="${height * 0.9932}" width="${width}" height="${Math.max(3, height * 0.0068)}" fill="#2c2c2c"/>
      <text x="${width * 0.1145}" y="${height * 0.927}" fill="#f2b000" font-size="${width * 0.0625}" font-weight="900" letter-spacing="-1.9">
        AUCTION STARTS:
      </text>
      <text x="${width * 0.1145}" y="${height * 0.974}" fill="#ffffff" font-size="${width * 0.0335}" font-weight="800">
        ${escapeXml(startsLine)}
      </text>
    </svg>
  `;
}

function createDefaultSvg(
  data: GraphicSubmission,
  embeddedImageHref: string | null,
  width: number,
  height: number,
) {
  const shortEdge = Math.min(width, height);

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
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
          <rect x="${width * 0.0815}" y="${height * 0.2037}" width="${width * 0.837}" height="${height * 0.4389}" rx="6" ry="6"/>
        </clipPath>
      </defs>

      <rect width="${width}" height="${height}" fill="url(#bg)"/>
      <rect width="${width}" height="${height}" fill="url(#goldFade)"/>
      <polygon points="${width},0 ${width},${height * 0.1667} ${width * 0.7315},0" fill="#f2a900" opacity="0.88"/>
      <polygon points="0,${height} 0,${height * 0.8519} ${width * 0.1944},${height}" fill="#f2a900" opacity="0.55"/>

      <rect x="${width * 0.0815}" y="${height * 0.0556}" width="${width * 0.2407}" height="${height * 0.0481}" fill="#f2a900"/>
      <text x="${width * 0.1}" y="${height * 0.087}" fill="#111111" font-size="${shortEdge * 0.0204}" font-weight="700" letter-spacing="4">
        ${escapeXml(truncate((data.type || "Graphic Type").toUpperCase(), 22))}
      </text>

      <g transform="translate(${width * 0.7148} ${height * 0.0537})">
        <text x="0" y="${shortEdge * 0.026}" fill="#f2a900" font-size="${shortEdge * 0.0444}" font-weight="800">JMA</text>
        <text x="0" y="${shortEdge * 0.0537}" fill="#ffffff" font-size="${shortEdge * 0.0167}" font-weight="600" letter-spacing="3">
          AUCTION GRAPHICS STUDIO
        </text>
      </g>

      <rect x="${width * 0.0815}" y="${height * 0.2037}" width="${width * 0.837}" height="${height * 0.4389}" fill="#0f0f0f" stroke="rgba(255,255,255,0.12)"/>
      ${
        embeddedImageHref
          ? `<image href="${embeddedImageHref}" x="${width * 0.0815}" y="${height * 0.2037}" width="${width * 0.837}" height="${height * 0.4389}" preserveAspectRatio="xMidYMid slice" clip-path="url(#imageClip)"/>`
          : `<rect x="${width * 0.0815}" y="${height * 0.2037}" width="${width * 0.837}" height="${height * 0.4389}" fill="#202020"/>
             <text x="${width / 2}" y="${height * 0.4167}" text-anchor="middle" fill="#6d6d6d" font-size="${shortEdge * 0.026}" letter-spacing="6">EQUIPMENT IMAGE</text>`
      }

      <rect x="${width * 0.0815}" y="${height * 0.687}" width="${width * 0.1667}" height="${Math.max(4, shortEdge * 0.0037)}" fill="#f2a900"/>
      <text x="${width * 0.0815}" y="${height * 0.7593}" fill="#ffffff" font-size="${shortEdge * 0.0667}" font-weight="800">
        ${escapeXml(truncate(data.title || "Auction Title Here", width > height ? 28 : 30))}
      </text>

      <text x="${width * 0.0815}" y="${height * 0.8519}" fill="#f2a900" font-size="${shortEdge * 0.0241}" font-weight="700" letter-spacing="2">
        ${escapeXml(`${data.date || "Date"} · ${data.time || "Time"}`)}
      </text>
      <text x="${width * 0.0815}" y="${height * 0.887}" fill="#ffffff" font-size="${shortEdge * 0.0222}" font-weight="500">
        ${escapeXml(truncate(data.location || "Location", 38))}
      </text>
      <text x="${width * 0.0815}" y="${height * 0.9204}" fill="#9d9d9d" font-size="${shortEdge * 0.0185}" font-weight="500">
        ${escapeXml(`${data.website || "Website"} · ${data.phone || "Phone"}`)}
      </text>

      <rect x="${width * 0.7037}" y="${height * 0.8333}" width="${width * 0.2148}" height="${height * 0.0778}" fill="#f2a900" stroke="#f2a900"/>
      <text x="${width * 0.8111}" y="${height * 0.8796}" text-anchor="middle" fill="#111111" font-size="${shortEdge * 0.0222}" font-weight="800" letter-spacing="2">
        ${escapeXml(truncate((data.cta || "Call To Action").toUpperCase(), 18))}
      </text>
    </svg>
  `;
}

export function createMockPreviewSvg(
  data: GraphicSubmission,
  embeddedImageHref?: string | null,
  channel = "Instagram Post",
) {
  const spec = getChannelSpec(channel);

  if (data.type === "Equipment Spotlight") {
    return createEquipmentSpotlightSvg(data, embeddedImageHref ?? null, spec.width, spec.height);
  }

  if (data.type === "Public Auction") {
    return createPublicAuctionSvg(data, embeddedImageHref ?? null, spec.width, spec.height);
  }

  return createDefaultSvg(data, embeddedImageHref ?? null, spec.width, spec.height);
}

export async function renderMockPreviewFile(
  data: GraphicSubmission,
  imageSource?: File | string | null,
  channel = "Instagram Post",
) {
  let embeddedImageHref: string | null = null;

  if (imageSource instanceof File) {
    embeddedImageHref = await fileToDataUrl(imageSource);
  } else if (typeof imageSource === "string" && imageSource.length > 0) {
    embeddedImageHref = await urlToDataUrl(imageSource);
  }

  const spec = getChannelSpec(channel);
  const svg = createMockPreviewSvg(data, embeddedImageHref, channel);
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
    canvas.width = spec.width;
    canvas.height = spec.height;
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Unable to create preview canvas.");
    }
    context.drawImage(image, 0, 0, spec.width, spec.height);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((value) => {
        if (value) {
          resolve(value);
        } else {
          reject(new Error("Unable to export preview PNG."));
        }
      }, "image/png");
    });

    const slug = channel.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return new File([blob], `generated-${slug}.png`, { type: "image/png" });
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}
