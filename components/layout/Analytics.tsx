"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { site } from "@/content/site";
import { captureUtm } from "@/lib/utm";

const GTM = process.env.NEXT_PUBLIC_GTM_ID;
const PIXEL = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const CLARITY = process.env.NEXT_PUBLIC_CLARITY_ID;
const KEY = "ag_consent";
type Consent = "all" | "necessary" | null;

/**
 * Banner de cookies + carga de GTM / Meta Pixel / Clarity SOLO tras "Aceptar".
 * Si no hay ningún ID configurado, no se muestra banner (no hay cookies de terceros).
 */
export function Analytics() {
  const [consent, setConsent] = useState<Consent | "unknown">("unknown");
  const anyTool = Boolean(GTM || PIXEL || CLARITY);

  useEffect(() => {
    captureUtm();
    let c: Consent = null;
    try {
      c = (localStorage.getItem(KEY) as Consent) ?? null;
    } catch {
      /* noop */
    }
    const t = window.setTimeout(() => setConsent(c), 0);
    return () => window.clearTimeout(t);
  }, []);

  const choose = (c: "all" | "necessary") => {
    try {
      localStorage.setItem(KEY, c);
    } catch {
      /* noop */
    }
    setConsent(c);
  };

  return (
    <>
      {consent === "all" && GTM && (
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM}');`}
        </Script>
      )}
      {consent === "all" && PIXEL && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIXEL}');fbq('track','PageView');`}
        </Script>
      )}
      {consent === "all" && CLARITY && (
        <Script id="clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "${CLARITY}");`}
        </Script>
      )}

      {anyTool && consent === null && (
        <div
          role="region"
          aria-label="Preferencias de cookies"
          className="card-glass fixed bottom-4 left-4 z-[65] max-w-[420px] rounded-[4px] p-5 pr-6 max-lg:right-4 max-lg:bottom-[calc(16px+env(safe-area-inset-bottom))]"
          style={{ animation: "modal-in 600ms var(--ease-out-expo)" }}
        >
          <p className="text-[14px] leading-relaxed text-paper/80">{site.cookies.texto}</p>
          <div className="mt-4 flex gap-3">
            <button type="button" onClick={() => choose("all")} className="btn btn-primary t-btn h-11! min-h-11! px-5!">
              <span className="btn-label">{site.cookies.aceptar}</span>
            </button>
            <button type="button" onClick={() => choose("necessary")} className="btn btn-ghost t-btn">
              <span className="btn-label">{site.cookies.rechazar}</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
