import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Upload, Sliders, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockupImages } from "@/lib/mock-data";
import { BrandMark } from "@/components/BrandMark";
import heroInspiration from "@/assets/jma-brand-inspiration.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "JMA Marketing Studio — Auction Graphics Built to Brand" },
      {
        name: "description",
        content:
          "Create Jeff Martin Auctioneers social graphics with the right logo, typography, color, and service-first tone.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/92 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-2.5">
          <Link to="/">
            <BrandMark inverted className="origin-left" />
          </Link>
          <nav className="hidden items-center gap-6 text-xs font-medium uppercase tracking-[0.18em] md:flex">
            <a href="#workflow" className="text-white/72 transition hover:text-white">
              Workflow
            </a>
            <a href="#library" className="text-white/72 transition hover:text-white">
              Template library
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="h-8 px-3 text-white hover:bg-white/10 hover:text-white"
            >
              <Link to="/login">Log in</Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="h-8 bg-gold px-3 text-gold-foreground hover:bg-gold/90"
            >
              <Link to="/signup">Open Studio</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-black text-white">
        <img
          src={heroInspiration}
          alt="Jeff Martin Auctioneers brand inspiration"
          className="absolute inset-0 h-full w-full object-cover opacity-28"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.88)_0%,rgba(0,0,0,0.74)_45%,rgba(0,0,0,0.5)_100%)]" />
        <div className="absolute inset-0 bg-grid opacity-35" />
        <div className="absolute -right-12 top-16 h-80 w-[32rem] bg-chevron opacity-95" />
        <div className="relative mx-auto grid min-h-[calc(100svh-57px)] max-w-7xl items-center gap-8 px-5 pb-8 pt-5 lg:grid-cols-[1.08fr_0.92fr] lg:pb-8 lg:pt-4">
          <div className="flex flex-col justify-center">
            <div className="brand-kicker mb-3 text-gold">JMA marketing studio</div>
            <h1 className="text-brand-display max-w-4xl text-5xl leading-[0.92] sm:text-6xl lg:text-7xl">
              Auction graphics built to the Jeff Martin standard.
            </h1>
            <p className="mt-4 max-w-xl text-base text-white/72 sm:text-lg">
              Translate equipment photos, sale details, and facility messaging into on-brand
              creative that respects the logo, the Gotham headline system, and the black-gold-white
              palette.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="bg-gold text-gold-foreground hover:bg-gold/90 font-bold uppercase tracking-[0.18em]"
              >
                <Link to="/signup">
                  Launch Studio <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white uppercase tracking-[0.18em]"
              >
                <Link to="/dashboard/templates">View templates</Link>
              </Button>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="relative w-full max-w-[27rem] border border-white/14 bg-white/6 p-4 backdrop-blur-sm">
              <div className="mb-3 flex items-start justify-between border-b border-white/10 pb-3">
                <div>
                  <div className="brand-kicker text-gold">Brand-compliant output</div>
                  <div className="mt-1.5 max-w-xs text-sm text-white/70">
                    Designed for facility campaigns, featured lots, and social follow-ups.
                  </div>
                </div>
                <BrandMark compact inverted className="origin-top-right" />
              </div>
              <div className="grid gap-3">
                <img
                  src={mockupImages[1]}
                  alt="Featured lot mockup"
                  className="aspect-[5/4] h-full w-full object-cover shadow-industrial"
                />
                <div className="flex items-center justify-between border border-white/10 bg-black/55 px-4 py-3">
                  <div>
                    <div className="text-brand-display text-lg text-white">Ready for publish</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.18em] text-white/58">
                      Instagram, Facebook, stories, and marketplace-ready
                    </div>
                  </div>
                  <Download className="h-5 w-5 shrink-0 text-gold" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="workflow" className="border-b border-border py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 max-w-3xl">
            <div className="brand-kicker mb-3 text-muted-foreground">Workflow</div>
            <h2 className="text-brand-display text-4xl sm:text-5xl">
              Operational speed, brand restraint.
            </h2>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              The studio follows the same structure the brand book asks for: clear hierarchy,
              approved messaging, and enough systemization that every facility can move fast without
              going off-brand.
            </p>
          </div>
          <div className="grid gap-px bg-border md:grid-cols-3">
            {[
              {
                n: "01",
                t: "Load inventory imagery",
                d: "Drop equipment, truck, or facility imagery into the builder and keep the focal point clean.",
                i: Upload,
              },
              {
                n: "02",
                t: "Apply approved messaging",
                d: "Auction date, location nomenclature, and CTA lock into a single operating surface.",
                i: Sliders,
              },
              {
                n: "03",
                t: "Export by channel",
                d: "Publish square posts for Instagram and Facebook, vertical story cuts, and feed-ready auction promos from one approved layout.",
                i: Download,
              },
            ].map((s) => (
              <div key={s.n} className="brand-panel p-10">
                <div className="flex items-start justify-between">
                  <s.i className="h-8 w-8 text-gold" strokeWidth={2.5} />
                  <span className="text-brand-display text-5xl text-muted-foreground/25">
                    {s.n}
                  </span>
                </div>
                <h3 className="mt-6 text-brand-display text-2xl">{s.t}</h3>
                <p className="mt-2 text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="library" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 max-w-3xl">
            <div className="brand-kicker mb-3 text-muted-foreground">Template library</div>
            <h2 className="text-brand-display text-4xl sm:text-5xl">
              Built for every auction moment.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Every template inherits the same headline system, contact treatment, and JMA hierarchy
              before the operator changes a single field.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {["Public Auction", "Featured Lot", "Bid Now", "Weekly Schedule"].map((t, i) => (
              <div
                key={t}
                className="group overflow-hidden border border-border bg-white transition hover:border-gold"
              >
                <div className="aspect-[4/5] overflow-hidden bg-black">
                  <img
                    src={mockupImages[i % 3]}
                    alt={t}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105 group-hover:opacity-92"
                  />
                </div>
                <div className="p-5">
                  <div className="brand-kicker text-gold">Template</div>
                  <h3 className="mt-3 text-brand-display text-xl">{t}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Approved structure with space for facility-specific dates, calls to action, and
                    high-contrast imagery.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-charcoal py-24 text-charcoal-foreground">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute inset-y-0 right-0 hidden w-96 bg-chevron opacity-80 lg:block" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-brand-display text-5xl sm:text-6xl">
            Move faster without drifting off brand.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-white/70">
            The studio now follows the JMA brand book’s palette, hierarchy, and type system so teams
            can focus on the auction, not on rebuilding the identity every time.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="bg-gold text-gold-foreground hover:bg-gold/90 font-bold uppercase tracking-[0.18em]"
            >
              <Link to="/signup">
                Open JMA Studio <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-sm text-muted-foreground sm:flex-row">
          <div>© 2026 Jeff Martin Auctioneers</div>
          <div className="flex gap-6">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
