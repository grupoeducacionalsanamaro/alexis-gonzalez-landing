import Image from "next/image";
import { ImageIcon } from "lucide-react";

type Props = {
  src: string | null;
  alt: string;
  /** Texto del placeholder mientras no hay foto */
  label?: string;
  sizes: string;
  tone?: "dark" | "light";
  className?: string;
  imgClassName?: string;
  priority?: boolean;
};

/**
 * Foto o, si aún no existe, un espacio reservado con el mismo tamaño
 * (marcado como pendiente) para cargarla después sin cambiar el layout.
 */
export function ImageSlot({ src, alt, label, sizes, tone = "dark", className = "", imgClassName = "", priority }: Props) {
  if (src) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={`object-cover ${imgClassName}`} />
      </div>
    );
  }
  const dark = tone === "dark";
  return (
    <div
      role="img"
      aria-label={`${alt} (foto pendiente)`}
      className={`slot relative grid place-items-center overflow-hidden ${dark ? "slot-dark" : "slot-light"} ${className}`}
    >
      <div className={`flex flex-col items-center gap-3 px-6 text-center ${dark ? "text-paper/45" : "text-ink-950/45"}`}>
        <ImageIcon strokeWidth={1.25} className="size-7" aria-hidden="true" />
        <span className="t-eyebrow text-[10px]! tracking-[0.2em]!">{label ?? "Foto pendiente"}</span>
      </div>
    </div>
  );
}
