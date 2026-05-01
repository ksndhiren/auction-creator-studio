import { cn } from "@/lib/utils";
import jmaLogo from "@/assets/jma-logo.png";
import jmaLogoWhite from "@/assets/jma-logo-white.png";

interface BrandMarkProps {
  className?: string;
  compact?: boolean;
  inverted?: boolean;
  showTagline?: boolean;
}

export function BrandMark({
  className,
  compact = false,
  inverted = false,
  showTagline = true,
}: BrandMarkProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className={cn("inline-flex w-fit", compact ? "max-w-[6.8rem]" : "max-w-[10.8rem]")}>
        <img
          src={inverted ? jmaLogoWhite : jmaLogo}
          alt="Jeff Martin Auctioneers"
          className="h-auto w-full"
        />
      </div>
      {showTagline ? (
        <div
          className={cn(
            "brand-tagline text-center text-[0.68rem]",
            inverted ? "text-gold" : "text-muted-foreground",
          )}
        >
          Auction Graphics Studio
        </div>
      ) : null}
    </div>
  );
}
