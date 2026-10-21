/** 5 estrellas de acento. `data-stars` → el orquestador las enciende una a una (80ms). */
export function Stars({ className = "", size = 14, label = "5 de 5" }: { className?: string; size?: number; label?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 ${className}`} role="img" aria-label={label} data-stars="">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className="star">
          <path
            d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z"
            fill="var(--accent-300)"
          />
        </svg>
      ))}
    </span>
  );
}
