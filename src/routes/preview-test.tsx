import { createFileRoute } from "@tanstack/react-router";
import { AuctionPreview } from "@/components/AuctionPreview";

export const Route = createFileRoute("/preview-test")({
  component: PreviewTestPage,
});

const SAMPLE: Record<string, Parameters<typeof AuctionPreview>[0]["data"]> = {
  "Equipment Spotlight": {
    type: "Equipment Spotlight",
    year: "2000",
    title: "LIEBHERR LTM 1300",
    category: "ALL TERRAIN CRANE",
    date: "2026-05-13",
    time: "10:00 AM",
    timezone: "CT",
    location: "",
    cta: "",
    website: "",
    phone: "",
  },
  "Public Auction": {
    type: "Public Auction",
    title: "Heavy Equipment Auction",
    date: "2026-05-13",
    time: "10:00 AM",
    timezone: "CT",
    location: "Dallas, TX",
    cta: "Bid Now",
    website: "jeffmartin.com",
    phone: "1-800-000-0000",
  },
};

const FORMATS = ["square", "story", "landscape", "portrait", "wide"] as const;

function PreviewTestPage() {
  return (
    <div className="min-h-screen bg-zinc-900 p-8 space-y-12">
      <div>
        <h1 className="text-white text-2xl font-bold mb-1">Template Preview Testbed</h1>
        <p className="text-zinc-400 text-sm">No auth required — for design iteration only.</p>
      </div>

      {Object.entries(SAMPLE).map(([type, data]) => (
        <section key={type} className="space-y-4">
          <h2 className="text-yellow-400 text-lg font-semibold uppercase tracking-widest border-b border-zinc-700 pb-2">
            {type}
          </h2>
          <div className="flex flex-wrap gap-6 items-start">
            {FORMATS.map((fmt) => (
              <div key={fmt} className="space-y-2">
                <div className="text-zinc-400 text-xs uppercase tracking-widest">{fmt}</div>
                <div
                  style={{
                    width: fmt === "story" ? 180 : fmt === "portrait" ? 220 : fmt === "landscape" || fmt === "wide" ? 360 : 280,
                  }}
                >
                  <AuctionPreview data={data} format={fmt} />
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
