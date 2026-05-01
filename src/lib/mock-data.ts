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

export const ctaOptions = ["Register to Bid", "Bid Now", "Consign Today", "View Inventory"];

export const equipmentCategories = [
  "Heavy Equipment",
  "Trucks & Trailers",
  "Agricultural",
  "Construction",
  "Vehicles",
  "Industrial",
];

export const templates = [
  {
    id: "t1",
    name: "Public Auction",
    type: "Public Auction",
    image: mock1,
    desc: "Stacked headline, gold action bar, and location-ready footer lockup.",
  },
  {
    id: "t2",
    name: "Featured Equipment",
    type: "Featured Lot",
    image: mock2,
    desc: "Hero equipment cut with room for lot callouts and service-first CTA.",
  },
  {
    id: "t3",
    name: "Multi-image Lot Grid",
    type: "Public Auction",
    image: mock1,
    desc: "High-density social layout for mixed fleets and category pushes.",
  },
  {
    id: "t4",
    name: "Weekly Auction Schedule",
    type: "Weekly Auction",
    image: mock3,
    desc: "Facility schedule panel for recurring event promotion.",
  },
  {
    id: "t5",
    name: "Truck & Equipment Push",
    type: "Bid Now",
    image: mock3,
    desc: "Newspaper-inspired layout tuned for truck and equipment inventory.",
  },
  {
    id: "t6",
    name: "Thank You Bidders",
    type: "Thank You Bidders",
    image: mock2,
    desc: "Event follow-up graphic with restrained badge system and brand close.",
  },
];

export const generations = [
  {
    id: "g1",
    title: "Brooklyn Spring Equipment Auction",
    type: "Public Auction",
    date: "2026-04-22",
    image: mock1,
  },
  { id: "g2", title: "CAT 320 Excavator", type: "Featured Lot", date: "2026-04-20", image: mock2 },
  { id: "g3", title: "Vocational Truck Fleet", type: "Bid Now", date: "2026-04-18", image: mock3 },
  { id: "g4", title: "Weekly Schedule W17", type: "Weekly", date: "2026-04-17", image: mock1 },
  {
    id: "g5",
    title: "Kissimmee Iron Spotlight",
    type: "Featured Lot",
    date: "2026-04-15",
    image: mock2,
  },
  {
    id: "g6",
    title: "Stanton Truck Auction Day",
    type: "Bid Now",
    date: "2026-04-12",
    image: mock3,
  },
  {
    id: "g7",
    title: "Pelzer Public Auction",
    type: "Public Auction",
    date: "2026-04-08",
    image: mock1,
  },
  { id: "g8", title: "Weekly Schedule W15", type: "Weekly", date: "2026-04-05", image: mock3 },
];

export const partners = [
  {
    id: "p1",
    name: "Marcus Vance",
    company: "JMA Marketing",
    email: "marcus@jeffmartinauctioneers.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: "p2",
    name: "Dana Rourke",
    company: "Kissimmee Facility",
    email: "dana@jeffmartinauctioneers.com",
    role: "Editor",
    status: "Active",
  },
  {
    id: "p3",
    name: "Eli Brandt",
    company: "South Carolina Facility",
    email: "eli@jeffmartinauctioneers.com",
    role: "Viewer",
    status: "Pending",
  },
  {
    id: "p4",
    name: "Sara Whitmore",
    company: "Texas Facility",
    email: "sara@jeffmartinauctioneers.com",
    role: "Editor",
    status: "Active",
  },
  {
    id: "p5",
    name: "Jonas King",
    company: "Specialty Auctions",
    email: "jonas@jeffmartinauctioneers.com",
    role: "Viewer",
    status: "Inactive",
  },
];
