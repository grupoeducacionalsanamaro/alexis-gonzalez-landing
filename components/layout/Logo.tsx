import Image from "next/image";

/** Logo oficial (diamante “AG” + nombre), versión blanca para fondos oscuros. 640×168. */
export function Logo({ className = "", priority }: { className?: string; priority?: boolean }) {
  return (
    <Image
      src="/img/logo-alexis-gonzalez.webp"
      alt="Alexis González"
      width={640}
      height={168}
      unoptimized
      priority={priority}
      className={`w-auto ${className}`}
    />
  );
}
