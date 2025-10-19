"use client";

import Link from "next/link";

type Edge = { label: string; href?: string };
type Props = {
  left?: Edge;   // default: { label: "Featured" }
  right?: Edge;  // default: { label: "More..." }
  className?: string;
};

export default function FeatureMoreBar({
  left = { label: "Featured" },
  right = { label: "More..." },
  className = "",
}: Props) {
  const Left = left.href ? (
    <Link
      href={left.href}
      className="font-bold text-secondary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 rounded-sm"
    >
      {left.label}
    </Link>
  ) : (
    <span className="font-bold text-secondary">{left.label}</span>
  );

  const rightBase =
    "font-medium rounded-md bg-accent px-6 py-2 text-primary hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 transition-all duration-200";

  const Right = right.href ? (
    <Link href={right.href} className={rightBase}>
      {right.label}
    </Link>
  ) : (
    <span className={rightBase}>{right.label}</span>
  );

  return (
    <nav
      role="navigation"
      aria-label="Feature bar"
      className={`w-full py-4 my-4 bg-primary ${className}`}
    >
      <div className="container mx-auto px-3 md:px-4 xl:px-6">
        <div className="flex items-center justify-between h-10">
          {Left}
          {Right}
        </div>
      </div>
    </nav>
  );
}
