/** Contador: renderiza el valor final (SEO/no-JS) y el orquestador lo anima con countUp al entrar. */
export function Counter({ to, className = "" }: { to: number; className?: string }) {
  return (
    <span className={`tabular-nums ${className}`} data-count={to}>
      {new Intl.NumberFormat("es-CL").format(to)}
    </span>
  );
}
