type Size = "sm" | "lg";

const STYLES: Record<Size, string> = {
  /** Eyebrow label used across inner pages and the EPK. */
  sm: "text-xs text-[#888] uppercase tracking-wider mb-4",
  /** Homepage section title. */
  lg: "text-[22px] font-medium text-[#888] tracking-tight mb-7",
};

export function SectionHeading({
  children,
  size = "sm",
  className = "",
}: {
  children: React.ReactNode;
  size?: Size;
  className?: string;
}) {
  return <h2 className={`${STYLES[size]} ${className}`}>{children}</h2>;
}
