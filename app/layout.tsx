import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import "@/styles/globals.css";
import { site } from "@/content/site";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { MotionOrchestrator } from "@/components/layout/MotionOrchestrator";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { Preloader } from "@/components/layout/Preloader";
import { Cursor } from "@/components/layout/Cursor";
import { Analytics } from "@/components/layout/Analytics";

// Montserrat variable (un solo archivo cubre 400–900): titulares Black/ExtraBold, textos Regular/Medium
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.seo.title,
  description: site.seo.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: "/",
    siteName: site.nombre,
    title: site.seo.title,
    description: site.seo.description,
  },
  twitter: { card: "summary_large_image", title: site.seo.title, description: site.seo.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0B",
  colorScheme: "dark",
};

/**
 * Se ejecuta antes del primer pintado:
 *  - `js`: habilita los estados iniciales de motion (sin JS todo queda visible)
 *  - `rm`: reduced motion (salvo override ?motion=full para revisión interna)
 *  - data-preloader="on": primera visita de la sesión, desktop, sin reduced-motion
 *  - fallback: si GSAP no carga en 6s, se muestran todos los contenidos
 */
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');var full=/[?&]motion=full/.test(location.search);try{if(full)sessionStorage.setItem('ag_motion','full');if(sessionStorage.getItem('ag_motion')==='full')full=true}catch(e){}var rm=!full&&window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;if(rm)d.classList.add('rm');try{if(${site.flags.showPreloader}&&!rm&&matchMedia('(min-width:1024px) and (pointer:fine)').matches&&!sessionStorage.getItem('ag_preloaded'))d.setAttribute('data-preloader','on')}catch(e){}setTimeout(function(){if(!window.__agMotion){d.classList.remove('js');d.removeAttribute('data-preloader')}},6000)})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-CL" className={montserrat.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        {/* Filtros del texto en contorno (.text-outline): solo el borde exterior de cada letra */}
        <svg aria-hidden="true" width="0" height="0" className="absolute">
          <defs>
            {[
              ["text-outline", 1.5],
              ["text-outline-lg", 2],
            ].map(([id, r]) => (
              <filter key={id} id={String(id)} x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
                <feMorphology in="SourceAlpha" operator="dilate" radius={r} result="grueso" />
                <feComposite in="grueso" in2="SourceAlpha" operator="out" result="borde" />
                <feFlood floodColor="#F5F5F2" floodOpacity="0.6" />
                <feComposite in2="borde" operator="in" />
              </filter>
            ))}
          </defs>
        </svg>
        <a href="#contenido" className="skip-link t-btn">
          Ir al contenido
        </a>
        <Preloader />
        <ScrollProgress />
        {children}
        <div aria-hidden="true" className="grain" />
        <SmoothScroll />
        <MotionOrchestrator />
        {site.flags.showCursor && <Cursor />}
        <Analytics />
      </body>
    </html>
  );
}
