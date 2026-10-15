/**
 * Wireframes geométricos (firma de marca). SVG inline de 1px.
 * `data-draw` → el orquestador de motion los dibuja con stroke-dashoffset al entrar.
 */
type Variant = "cube" | "prism" | "stack" | "cluster";

type Props = {
  variant: Variant;
  className?: string;
  draw?: boolean;
  strokeOpacity?: number;
  stroke?: string;
  strokeWidth?: number;
};

const SHAPES: Record<Variant, { viewBox: string; d: string[] }> = {
  // Cubo isométrico con aristas ocultas
  cube: {
    viewBox: "0 0 200 220",
    d: [
      "M100 10 L180 55 L180 155 L100 200 L20 155 L20 55 Z",
      "M20 55 L100 100 L180 55",
      "M100 100 L100 200",
      "M100 10 L100 100",
      "M20 155 L100 110 L180 155",
      "M60 32.5 L60 132.5 M140 32.5 L140 132.5",
    ],
  },
  // Prisma triangular
  prism: {
    viewBox: "0 0 220 220",
    d: [
      "M110 12 L200 180 L20 180 Z",
      "M110 12 L140 150 L200 180",
      "M140 150 L20 180",
      "M110 12 L80 120 L20 180",
      "M80 120 L200 180 M80 120 L140 150",
    ],
  },
  // Estructura de bloques apilados
  stack: {
    viewBox: "0 0 240 240",
    d: [
      "M120 20 L190 58 L120 96 L50 58 Z",
      "M50 58 L50 98 L120 136 L190 98 L190 58",
      "M120 96 L120 136",
      "M50 112 L50 152 L120 190 L190 152 L190 112",
      "M50 112 L120 150 L190 112",
      "M120 150 L120 190",
      "M50 166 L50 206 L120 232 L190 206 L190 166",
      "M50 166 L120 204 L190 166 M120 204 L120 232",
    ],
  },
  // Cúmulo de poliedros
  cluster: {
    viewBox: "0 0 320 260",
    d: [
      "M90 30 L150 64 L150 134 L90 168 L30 134 L30 64 Z",
      "M30 64 L90 98 L150 64 M90 98 L90 168",
      "M200 70 L280 110 L250 200 L160 190 L150 120 Z",
      "M200 70 L215 145 L280 110 M215 145 L250 200 M215 145 L160 190 M215 145 L150 120",
      "M120 170 L170 196 L170 246 L120 220 Z M170 196 L220 170 L220 220 L170 246",
      "M120 170 L170 144 L220 170",
    ],
  },
};

export function Wireframe({ variant, className = "", draw = true, strokeOpacity = 0.55, stroke = "var(--ink-700)", strokeWidth = 1 }: Props) {
  const s = SHAPES[variant];
  return (
    <svg
      viewBox={s.viewBox}
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
      data-draw={draw ? "" : undefined}
      data-variant={variant}
    >
      {/* Sin vector-effect: el dibujo por stroke-dashoffset usa unidades del viewBox */}
      <g stroke={stroke} strokeOpacity={strokeOpacity} strokeWidth={strokeWidth} strokeLinejoin="round">
        {s.d.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
    </svg>
  );
}
