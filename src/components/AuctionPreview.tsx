import { ImageIcon } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";

export interface PreviewData {
  type: string;
  title: string;
  date: string;
  time: string;
  location: string;
  cta: string;
  website: string;
  phone: string;
  imageUrl?: string;
}

export function AuctionPreview({ data }: { data: PreviewData }) {
  return (
    <div className="relative aspect-square w-full overflow-hidden bg-charcoal text-charcoal-foreground shadow-industrial">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(242,169,0,0.18),transparent_38%)]" />
      <div className="absolute right-0 top-0 h-28 w-56 bg-chevron opacity-90" />
      <div className="absolute bottom-0 left-0 h-24 w-44 rotate-180 bg-chevron opacity-60" />

      <div className="absolute left-5 top-5 z-10 bg-gold px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-gold-foreground">
        {data.type || "Public Auction"}
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
        <h3 className="text-brand-display text-[1.9rem] leading-none text-white drop-shadow sm:text-[2.2rem]">
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
            {data.website || "jeffmartinauctioneers.com"} · {data.phone || "844.450.6200"}
          </div>
        </div>
        <div className="border border-gold bg-gold px-3 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-gold-foreground">
          {data.cta || "Register to Bid"}
        </div>
      </div>
    </div>
  );
}
