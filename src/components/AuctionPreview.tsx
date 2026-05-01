import { ImageIcon } from "lucide-react";

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
      {/* diagonal stripe corner */}
      <div className="absolute -top-8 -left-8 h-24 w-48 rotate-[-35deg] bg-diagonal opacity-80" />
      <div className="absolute -bottom-8 -right-8 h-24 w-48 rotate-[-35deg] bg-diagonal opacity-80" />

      {/* logo placeholder */}
      <div className="absolute top-5 right-5 z-10 border border-gold/60 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-gold">
        Your Logo
      </div>

      {/* type label */}
      <div className="absolute top-5 left-5 z-10 bg-gold px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-gold-foreground">
        {data.type || "Public Auction"}
      </div>

      {/* image area */}
      <div className="absolute inset-x-6 top-[28%] bottom-[34%] overflow-hidden bg-black/30 ring-1 ring-white/5">
        {data.imageUrl ? (
          <img
            src={data.imageUrl}
            alt="equipment"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-white/30">
            <ImageIcon className="h-10 w-10" />
            <span className="text-xs uppercase tracking-widest">Equipment Image</span>
          </div>
        )}
      </div>

      {/* headline */}
      <div className="absolute inset-x-6 bottom-[18%] z-10">
        <div className="h-1 w-12 bg-gold mb-2" />
        <h3 className="text-stencil text-3xl leading-none text-white drop-shadow">
          {data.title || "Auction Title Here"}
        </h3>
      </div>

      {/* footer */}
      <div className="absolute inset-x-6 bottom-5 flex items-end justify-between">
        <div className="text-[10px] uppercase tracking-widest text-white/70 leading-relaxed">
          <div className="text-gold font-bold">
            {data.date || "Date"} · {data.time || "Time"}
          </div>
          <div>{data.location || "Location"}</div>
          <div className="text-white/50">{data.website || "yoursite.com"} · {data.phone || "555-000-0000"}</div>
        </div>
        <div className="bg-gold px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-gold-foreground">
          {data.cta || "Register to Bid"}
        </div>
      </div>
    </div>
  );
}
