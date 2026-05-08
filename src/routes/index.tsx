import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import heroInspiration from "@/assets/jma-brand-inspiration.jpg";
import { BrandMark } from "@/components/BrandMark";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Graphics Studio" },
      {
        name: "description",
        content:
          "Turn auction design requests into branded output images for the JMA marketing team.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  const { session } = useAuth();

  return (
    <div className="min-h-screen bg-black text-white">
      <section className="relative flex min-h-screen items-center overflow-hidden">
        <img
          src={heroInspiration}
          alt="JMA marketing inspiration"
          className="absolute inset-0 h-full w-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.88)_0%,rgba(0,0,0,0.72)_55%,rgba(0,0,0,0.78)_100%)]" />
        <div className="absolute -right-20 top-0 h-full w-[24rem] bg-chevron opacity-90" />

        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12">
          <BrandMark
            inverted
            showTagline={false}
            className="mx-auto -mt-2 origin-center justify-center"
          />

          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-brand-display text-5xl leading-[0.94] sm:text-6xl lg:text-7xl">
              Graphics Studio
            </h1>
            <div className="mt-8">
              <Button
                asChild
                size="lg"
                className="bg-gold text-gold-foreground hover:bg-gold/90 uppercase tracking-[0.18em] font-bold"
              >
                <Link to={session ? "/dashboard" : "/login"}>
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
