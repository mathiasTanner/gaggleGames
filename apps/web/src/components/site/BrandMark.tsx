import Link from "next/link";

type BrandMarkProps = {
  compact?: boolean;
};

export default function BrandMark({ compact = false }: BrandMarkProps) {
  return (
    <Link href="/" className="flex items-center gap-3 font-semibold tracking-tight">
      <span className="grid size-10 place-items-center rounded bg-primary text-lg font-black text-primary-foreground shadow-sm">
        GG
      </span>
      {!compact ? <span className="text-lg">Gaggle Game</span> : null}
    </Link>
  );
}
