/** Filete dorado 1px que crece desde el centro al entrar (data-grow). */
export function SectionDivider({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      data-grow=""
      className={`mx-auto h-px w-full max-w-[320px] origin-center ${className}`}
      style={{ background: "var(--gold-gradient)" }}
    />
  );
}
