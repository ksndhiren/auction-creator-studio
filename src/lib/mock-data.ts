import mock1 from "@/assets/auction-mockup-1.jpg";
import mock2 from "@/assets/auction-mockup-2.jpg";
import mock3 from "@/assets/auction-mockup-3.jpg";

export const mockupImages = [mock1, mock2, mock3];

export type GraphicType =
  | "Public Auction"
  | "Featured Lot"
  | "Bid Now"
  | "Consign Today"
  | "Weekly Auction"
  | "Thank You Bidders";

export const graphicTypes: GraphicType[] = [
  "Public Auction",
  "Featured Lot",
  "Bid Now",
  "Consign Today",
  "Weekly Auction",
  "Thank You Bidders",
];

export const ctaOptions = [
  "Register to Bid",
  "Bid Now",
  "Consign Today",
  "View Inventory",
];

export const equipmentCategories = [
  "Heavy Equipment",
  "Trucks & Trailers",
  "Agricultural",
  "Construction",
  "Vehicles",
  "Industrial",
];

export const templates = [
  { id: "t1", name: "Public Auction", type: "Public Auction", image: mock1, desc: "Bold headline with dates and CTA badge." },
  { id: "t2", name: "Featured Equipment", type: "Featured Lot", image: mock2, desc: "Spotlight a single hero lot." },
  { id: "t3", name: "Multi-image Lot Grid", type: "Public Auction", image: mock1, desc: "Showcase multiple lots in one post." },
  { id: "t4", name: "Weekly Auction Schedule", type: "Weekly Auction", image: mock3, desc: "Recurring weekly schedule layout." },
  { id: "t5", name: "Vehicle Auction", type: "Bid Now", image: mock3, desc: "Optimized for cars, trucks and fleets." },
  { id: "t6", name: "Thank You Post", type: "Thank You Bidders", image: mock2, desc: "Post-event appreciation graphic." },
];

export const generations = [
  { id: "g1", title: "Spring Equipment Auction", type: "Public Auction", date: "2026-04-22", image: mock1 },
  { id: "g2", title: "CAT 320 Excavator", type: "Featured Lot", date: "2026-04-20", image: mock2 },
  { id: "g3", title: "Fleet Trucks Lot 14", type: "Bid Now", date: "2026-04-18", image: mock3 },
  { id: "g4", title: "Weekly Schedule W17", type: "Weekly", date: "2026-04-17", image: mock1 },
  { id: "g5", title: "Featured Bulldozer", type: "Featured Lot", date: "2026-04-15", image: mock2 },
  { id: "g6", title: "Truck Auction Day", type: "Bid Now", date: "2026-04-12", image: mock3 },
  { id: "g7", title: "Public Auction April", type: "Public Auction", date: "2026-04-08", image: mock1 },
  { id: "g8", title: "Weekly Schedule W15", type: "Weekly", date: "2026-04-05", image: mock3 },
];

export const partners = [
  { id: "p1", name: "Marcus Vance", company: "Vance Heavy Equipment", email: "marcus@vance.co", role: "Admin", status: "Active" },
  { id: "p2", name: "Dana Rourke", company: "Rourke Trucking Co.", email: "dana@rourke.co", role: "Editor", status: "Active" },
  { id: "p3", name: "Eli Brandt", company: "Brandt Auctions", email: "eli@brandt.com", role: "Viewer", status: "Pending" },
  { id: "p4", name: "Sara Whitmore", company: "Whitmore Industrial", email: "sara@whitmore.co", role: "Editor", status: "Active" },
  { id: "p5", name: "Jonas King", company: "King Fleet Partners", email: "jonas@kingfleet.com", role: "Viewer", status: "Inactive" },
];
