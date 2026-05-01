import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Upload, Sliders, Download, Check, Gavel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockupImages } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Auction Creative Studio — Generate Auction Graphics in Minutes" },
      { name: "description", content: "Upload equipment photos, add auction details, and create branded social posts instantly." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center bg-charcoal text-gold">
              <Gavel className="h-5 w-5" strokeWidth={2.5} />
            </div>
            <span className="font-display text-lg uppercase tracking-wider">Auction <span className="text-muted-foreground">Creative Studio</span></span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
            <a href="#how" className="hover:text-foreground/70">How it works</a>
            <a href="#templates" className="hover:text-foreground/70">Templates</a>
            <a href="#benefits" className="hover:text-foreground/70">Benefits</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm"><Link to="/login">Log in</Link></Button>
            <Button asChild size="sm" className="bg-gold text-gold-foreground hover:bg-gold/90"><Link to="/signup">Get Started</Link></Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-charcoal text-charcoal-foreground">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute -top-20 -right-20 h-72 w-[36rem] rotate-[-25deg] bg-diagonal opacity-30" />
        <div className="relative mx-auto grid max-w-7xl gap-16 px-6 py-24 lg:grid-cols-2 lg:py-32">
          <div className="flex flex-col justify-center">
            <span className="mb-6 inline-flex w-fit items-center gap-2 border border-gold/40 bg-gold/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-gold">
              <span className="h-1.5 w-1.5 bg-gold" /> Built for Auction Pros
            </span>
            <h1 className="text-stencil text-5xl leading-[0.95] sm:text-6xl lg:text-7xl">
              Generate Auction <br />
              Graphics <span className="text-gold">in Minutes</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-white/70">
              Upload equipment photos, add auction details, and create branded social posts instantly.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90 font-bold uppercase tracking-wider">
                <Link to="/signup">Start Creating <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white uppercase tracking-wider">
                <Link to="/dashboard/templates">View Templates</Link>
              </Button>
            </div>
            <div className="mt-12 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
              {[["12K+", "Graphics generated"], ["340+", "Auction partners"], ["6", "Template formats"]].map(([n, l]) => (
                <div key={l}>
                  <div className="text-stencil text-3xl text-gold">{n}</div>
                  <div className="text-xs uppercase tracking-widest text-white/60">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Mockup stack */}
          <div className="relative flex items-center justify-center">
            <div className="relative h-[28rem] w-[28rem] max-w-full">
              <img src={mockupImages[1]} alt="Featured Lot auction graphic preview" width={400} height={400} className="absolute -left-8 top-12 h-56 w-56 rotate-[-8deg] object-cover shadow-industrial ring-1 ring-white/10" />
              <img src={mockupImages[2]} alt="Bid Now auction graphic preview" width={400} height={400} className="absolute right-0 top-0 h-64 w-64 rotate-[6deg] object-cover shadow-industrial ring-1 ring-white/10" />
              <img src={mockupImages[0]} alt="Public Auction graphic preview" width={500} height={500} className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 object-cover shadow-industrial ring-2 ring-gold/40" />
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-b border-border py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 max-w-2xl">
            <div className="mb-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">How it works</div>
            <h2 className="text-stencil text-4xl sm:text-5xl">Three Steps. <span className="text-muted-foreground">Done.</span></h2>
          </div>
          <div className="grid gap-px bg-border md:grid-cols-3">
            {[
              { n: "01", t: "Upload Photo", d: "Drop equipment or vehicle photos right into the studio.", i: Upload },
              { n: "02", t: "Add Details", d: "Auction date, location, CTA — fill in the form.", i: Sliders },
              { n: "03", t: "Generate Posts", d: "Export ready-to-post graphics for every channel.", i: Download },
            ].map((s) => (
              <div key={s.n} className="bg-background p-10">
                <div className="flex items-start justify-between">
                  <s.i className="h-8 w-8 text-gold" strokeWidth={2.5} />
                  <span className="text-stencil text-5xl text-muted-foreground/30">{s.n}</span>
                </div>
                <h3 className="mt-6 text-stencil text-2xl">{s.t}</h3>
                <p className="mt-2 text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Template types */}
      <section id="templates" className="bg-secondary py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <div className="mb-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">Templates</div>
              <h2 className="text-stencil text-4xl sm:text-5xl">Built for every <span className="text-gold">auction moment</span>.</h2>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {["Public Auction", "Featured Lot", "Bid Now", "Consign Today", "Weekly Auctions"].map((t, i) => (
              <div key={t} className="group relative aspect-[4/5] overflow-hidden bg-charcoal">
                <img src={mockupImages[i % 3]} alt={t} loading="lazy" className="h-full w-full object-cover opacity-60 transition group-hover:opacity-90" />
                <div className="absolute inset-0 flex flex-col justify-end p-5">
                  <div className="h-1 w-8 bg-gold mb-2" />
                  <div className="text-stencil text-xl text-white">{t}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 max-w-2xl">
            <div className="mb-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">Benefits</div>
            <h2 className="text-stencil text-4xl sm:text-5xl">Run a tighter <span className="text-gold">marketing op</span>.</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { t: "Brand Consistency", d: "Lock logos, colors and CTAs into a brand kit." },
              { t: "Faster Posting", d: "Go from photo to post in under 60 seconds." },
              { t: "Partner Access", d: "Invite auction partners with role-based access." },
              { t: "Multi-format Export", d: "Square, story, landscape — exported in one click." },
            ].map((b) => (
              <div key={b.t} className="border border-border p-8 transition hover:border-gold">
                <Check className="h-6 w-6 text-gold" strokeWidth={2.5} />
                <h3 className="mt-4 text-stencil text-xl">{b.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-charcoal py-24 text-charcoal-foreground">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-stencil text-5xl sm:text-6xl">Stop designing. <br /><span className="text-gold">Start auctioning.</span></h2>
          <p className="mx-auto mt-6 max-w-xl text-white/70">Join hundreds of auction companies using Auction Creative Studio to ship branded social posts every week.</p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90 font-bold uppercase tracking-wider">
              <Link to="/signup">Start Creating Free <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-sm text-muted-foreground sm:flex-row">
          <div>© 2026 Auction Creative Studio</div>
          <div className="flex gap-6"><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Contact</a></div>
        </div>
      </footer>
    </div>
  );
}
