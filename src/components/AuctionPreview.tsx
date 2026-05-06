import { ImageIcon } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";

export type ChannelPreviewFormat = "square" | "story" | "landscape" | "portrait" | "wide";

export interface PreviewData {
  type: string;
  year?: string;
  title: string;
  date: string;
  time: string;
  timezone?: string;
  location: string;
  cta: string;
  website: string;
  phone: string;
  imageUrl?: string;
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

function getPreviewAspect(format: ChannelPreviewFormat) {
  if (format === "story") {
    return "aspect-[9/16]";
  }

  if (format === "landscape") {
    return "aspect-[1.91/1]";
  }

  if (format === "portrait") {
    return "aspect-[4/5]";
  }

  if (format === "wide") {
    return "aspect-[16/9]";
  }

  return "aspect-square";
}

export function AuctionPreview({
  data,
  format = "square",
}: {
  data: PreviewData;
  format?: ChannelPreviewFormat;
}) {
  if (data.type === "Equipment Spotlight") {
    return (
      <div
        className={`relative w-full overflow-hidden bg-[#0a0a0a] text-charcoal-foreground shadow-industrial ${getPreviewAspect(
          format,
        )}`}
      >
        <div className="absolute inset-x-0 top-0 h-[27.55%] bg-[#f2b000]" />
        <div className="absolute right-0 top-0 h-[27.55%] w-[40.1%] bg-black" />
        <div
          className="absolute right-[39.9%] top-0 h-[27.55%] w-[11.4%] bg-[#f2b000]"
          style={{ clipPath: "polygon(0 50%, 100% 0, 100% 100%)" }}
        />
        <div className="absolute inset-x-0 top-[27.55%] h-[0.52%] bg-black/95" />

        <div className="absolute left-[4.7%] top-[4.35%] z-10 text-black">
          <div className="text-[4.08rem] font-black leading-[0.9] tracking-[-0.065em]">
            {data.year || "2000"}
          </div>
          <div className="mt-[1.55%] max-w-[60vw] text-[2rem] font-black uppercase leading-[0.93] tracking-[-0.055em]">
            {data.title || "LIEBHERR LTM 1300"}
          </div>
          <div className="mt-[2.35%] text-[1.08rem] font-extrabold uppercase leading-none tracking-[-0.018em] text-white">
            {data.category || "ALL TERRAIN CRANE"}
          </div>
        </div>

        <div className="absolute right-[4.1%] top-[3.95%] z-10">
          <BrandMark
            inverted
            compact
            showTagline={false}
            className="max-w-[10.2rem] scale-[1.26] origin-top-right"
          />
        </div>

        <div className="absolute inset-x-0 top-[28.05%] bottom-[15.55%] overflow-hidden">
          {data.imageUrl ? (
            <img src={data.imageUrl} alt="equipment" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[#151515] text-white/30">
              <ImageIcon className="h-10 w-10" />
              <span className="text-xs uppercase tracking-widest">Equipment Image</span>
            </div>
          )}
        </div>

        <div className="absolute inset-x-0 bottom-0 h-[15.55%] bg-black" />
        <div
          className="absolute bottom-0 left-0 h-[15.55%] w-[6.15%] bg-[#f2b000]"
          style={{ clipPath: "polygon(0 0, 100% 50%, 0 100%)" }}
        />
        <div className="absolute inset-x-0 bottom-[0.2%] h-[0.68%] bg-[#2b2b2b]" />

        <div className="absolute inset-x-[11.65%] bottom-[3.2%] z-10">
          <div className="text-[2.58rem] font-black uppercase leading-none tracking-[-0.06em] text-[#f2b000]">
            Auction Starts:
          </div>
          <div className="mt-[0.75%] text-[1.14rem] font-extrabold uppercase leading-none tracking-[-0.024em] text-white">
            {formatAuctionStarts(data.date, data.time, data.timezone)}
          </div>
        </div>
      </div>
    );
  }

  if (data.type === "Public Auction") {
    return (
      <div
        className={`relative w-full overflow-hidden bg-[#090909] text-charcoal-foreground shadow-industrial ${getPreviewAspect(
          format,
        )}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(242,169,0,0.2),transparent_30%)]" />
        <div className="absolute inset-y-0 right-[-8%] w-[38%] rotate-[14deg] bg-gold/90" />
        <div className="absolute inset-y-0 right-[8%] w-[16%] rotate-[14deg] bg-white/14" />

        <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between border-b border-white/10 bg-black/62 px-6 py-5 backdrop-blur-sm">
          <div className="border border-gold bg-gold px-3 py-1 text-[11px] font-bold uppercase tracking-[0.28em] text-gold-foreground">
            {data.type || "Public Auction"}
          </div>
          <BrandMark compact inverted className="scale-[0.78] origin-top-right" />
        </div>

        <div className="absolute inset-x-0 top-[88px] bottom-[218px] overflow-hidden">
          {data.imageUrl ? (
            <img src={data.imageUrl} alt="equipment" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[#151515] text-white/30">
              <ImageIcon className="h-10 w-10" />
              <span className="text-xs uppercase tracking-widest">Equipment Image</span>
            </div>
          )}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.18),rgba(0,0,0,0.74))]" />
        </div>

        <div className="absolute left-0 right-0 bottom-[112px] z-10">
          <div className="max-w-[78%] bg-black/78 px-6 py-6 backdrop-blur-sm">
            <div className="mb-4 h-[5px] w-24 bg-gold" />
            <h3 className="text-brand-display break-words text-[2.45rem] leading-[0.92] text-white drop-shadow sm:text-[2.85rem]">
              {data.title || "Auction Title Here"}
            </h3>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 grid grid-cols-[1fr_auto] items-stretch bg-[#0f0f0f]">
          <div className="space-y-2 px-6 py-5 text-[10px] uppercase tracking-[0.22em] text-white/78">
            <div className="font-bold text-gold">
              {data.date || "Date"} · {data.time || "Time"}
            </div>
            <div>{data.location || "Location"}</div>
            <div className="text-white/48">
              {data.website || "Website"} · {data.phone || "Phone"}
            </div>
          </div>
          <div className="flex min-w-[228px] items-center justify-center border-l border-white/10 bg-gold px-5 text-center text-[11px] font-bold uppercase tracking-[0.24em] text-gold-foreground">
            {data.cta || "Call To Action"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full overflow-hidden bg-charcoal text-charcoal-foreground shadow-industrial ${getPreviewAspect(
        format,
      )}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(242,169,0,0.18),transparent_38%)]" />
      <div className="absolute right-0 top-0 h-28 w-56 bg-chevron opacity-90" />
      <div className="absolute bottom-0 left-0 h-24 w-44 rotate-180 bg-chevron opacity-60" />

      <div className="absolute left-5 top-5 z-10 bg-gold px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-gold-foreground">
        {data.type || "Graphic Type"}
      </div>
      <div className="absolute right-5 top-5 z-10">
        <BrandMark compact inverted className="scale-[0.78] origin-top-right" />
      </div>

      <div className="absolute inset-x-6 top-[22%] bottom-[30%] overflow-hidden border border-white/10 bg-black/30">
        {data.imageUrl ? (
          <img src={data.imageUrl} alt="equipment" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-white/30">
            <ImageIcon className="h-10 w-10" />
            <span className="text-xs uppercase tracking-widest">Equipment Image</span>
          </div>
        )}
      </div>

      <div className="absolute inset-x-6 bottom-[18%] z-10">
        <div className="brand-rule mb-3" />
        <h3 className="text-brand-display break-words text-[1.9rem] leading-none text-white drop-shadow sm:text-[2.2rem]">
          {data.title || "Auction Title Here"}
        </h3>
      </div>

      <div className="absolute inset-x-6 bottom-5 flex items-end justify-between gap-4">
        <div className="text-[10px] uppercase tracking-[0.22em] text-white/70 leading-relaxed">
          <div className="font-bold text-gold">
            {data.date || "Date"} · {data.time || "Time"}
          </div>
          <div>{data.location || "Location"}</div>
          <div className="text-white/50">
            {data.website || "Website"} · {data.phone || "Phone"}
          </div>
        </div>
        <div className="border border-gold bg-gold px-3 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-gold-foreground">
          {data.cta || "Call To Action"}
        </div>
      </div>
    </div>
  );
}
