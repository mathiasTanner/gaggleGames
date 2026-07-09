import Link from "next/link";
import Image from "next/image";

type BrandMarkProps = {
  compact?: boolean;
  logoUrl?: string;
  logoAlt?: string;
  siteName: string;
};

export default function BrandMark({
  compact = false,
  logoUrl,
  logoAlt,
  siteName,
}: BrandMarkProps) {
  return (
    <Link href="/" className="flex items-center gap-3 font-semibold tracking-tight">
      {logoUrl ? (
        <Image
          src={logoUrl}
          alt={logoAlt ?? siteName}
          width={192}
          height={64}
          className="h-10 w-auto"
          priority
        />
      ) : (
        <span className="grid size-10 place-items-center rounded bg-primary text-lg font-black text-primary-foreground shadow-sm">
          {siteName
            .split(" ")
            .map((word) => word[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()}
        </span>
      )}
      {!compact ? <span className="text-lg">{siteName}</span> : null}
    </Link>
  );
}
