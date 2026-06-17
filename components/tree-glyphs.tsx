import type { ReactNode } from "react";
import type { LifeCategory } from "@/lib/types";

const glyphTitles: Record<LifeCategory, string> = {
  health: "Health glyph",
  mind: "Mind glyph",
  career: "Career glyph",
  business: "Business glyph",
  finance: "Finance glyph",
  relationships: "Relationships glyph",
  creativity: "Creativity glyph"
};

type CategoryGlyphProps = {
  category: LifeCategory;
  size?: number;
  className?: string;
};

function GlyphShell({ category, size = 25, className, children }: CategoryGlyphProps & { children: ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{glyphTitles[category]}</title>
      <path d="M16 2.8 26.9 9.1v13.8L16 29.2 5.1 22.9V9.1L16 2.8Z" stroke="currentColor" strokeWidth="1.35" opacity="0.5" />
      <circle cx="16" cy="16" r="10.4" stroke="currentColor" strokeWidth="1" opacity="0.22" />
      {children}
    </svg>
  );
}

export function CategoryGlyph({ category, size, className }: CategoryGlyphProps) {
  if (category === "health") {
    return (
      <GlyphShell category={category} size={size} className={className}>
        <path d="M8.8 17.2h4l1.8-5.4 3.1 9.1 1.7-3.7h3.8" stroke="currentColor" strokeWidth="2.05" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 7.7 22.9 12v8L16 24.3 9.1 20v-8L16 7.7Z" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      </GlyphShell>
    );
  }

  if (category === "mind") {
    return (
      <GlyphShell category={category} size={size} className={className}>
        <path d="M7.9 16s3.1-5.1 8.1-5.1 8.1 5.1 8.1 5.1-3.1 5.1-8.1 5.1S7.9 16 7.9 16Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <circle cx="16" cy="16" r="2.65" stroke="currentColor" strokeWidth="1.65" />
        <path d="M16 6.8v3.2M16 22v3.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.55" />
      </GlyphShell>
    );
  }

  if (category === "career") {
    return (
      <GlyphShell category={category} size={size} className={className}>
        <path d="M10.3 21.7 13 10.6l8.7-2.3-2.7 11.1-8.7 2.3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <circle cx="16" cy="16" r="2" fill="currentColor" opacity="0.55" />
        <path d="M9.2 23.1 22.8 8.9" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" opacity="0.35" />
      </GlyphShell>
    );
  }

  if (category === "business") {
    return (
      <GlyphShell category={category} size={size} className={className}>
        <path d="M16 7.6c3.4 2.3 5.4 5.7 5.1 10.1l3 3-3.4 1.1-1.1 3-3-3c-4.4.3-7.8-1.7-10.1-5.1 3.7-1 6.2-3.5 9.5-9.1Z" stroke="currentColor" strokeWidth="1.65" strokeLinejoin="round" />
        <path d="M13.7 18.3 10.2 21.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="17.9" cy="13.8" r="1.5" fill="currentColor" opacity="0.6" />
      </GlyphShell>
    );
  }

  if (category === "finance") {
    return (
      <GlyphShell category={category} size={size} className={className}>
        <path d="M9.2 13.1 16 8.8l6.8 4.3v9.3H9.2v-9.3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M11.4 19.6h9.2M12.4 15.2h7.2" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" opacity="0.7" />
        <path d="M13.2 22.4v-7.2M18.8 22.4v-7.2" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" opacity="0.45" />
      </GlyphShell>
    );
  }

  if (category === "relationships") {
    return (
      <GlyphShell category={category} size={size} className={className}>
        <circle cx="10.6" cy="16" r="3" stroke="currentColor" strokeWidth="1.75" />
        <circle cx="21.4" cy="16" r="3" stroke="currentColor" strokeWidth="1.75" />
        <path d="M13.5 16h5M11.7 12.4 16 8.4l4.3 4M11.7 19.6 16 23.6l4.3-4" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round" opacity="0.68" />
      </GlyphShell>
    );
  }

  return (
    <GlyphShell category={category} size={size} className={className}>
      <path d="M16 7.2 17.9 13l6.1-1.1-4.2 4.5 4.2 4.5-6.1-1.1L16 25.6l-1.9-5.8L8 20.9l4.2-4.5L8 11.9l6.1 1.1L16 7.2Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <circle cx="16" cy="16.4" r="2.2" fill="currentColor" opacity="0.5" />
    </GlyphShell>
  );
}
