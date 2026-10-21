import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/content/site";

export const alt = site.seo.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  const img = await readFile(join(process.cwd(), "public/img/og-portrait.jpg"));
  const src = `data:image/jpeg;base64,${img.toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#0A0A0B", position: "relative" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" width={504} height={630} style={{ position: "absolute", right: 0, top: 0, width: 504, height: 630, objectFit: "cover", filter: "grayscale(0.9)" }} />
        <div style={{ position: "absolute", right: 0, top: 0, width: 504, height: 630, display: "flex", background: "linear-gradient(to right, #0A0A0B 0%, rgba(10,10,11,0.4) 35%, rgba(10,10,11,0) 70%)" }} />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 72px", width: 780, height: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, color: "#F5F5F2", fontSize: 18, letterSpacing: 5, textTransform: "uppercase" }}>
            <div style={{ width: 32, height: 1, background: "#8A17B2" }} />
            Mentoría 1:1 · Método {site.marca}
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: 32, fontSize: 64, lineHeight: 1.02, fontWeight: 900, textTransform: "uppercase", letterSpacing: -1 }}>
            <span style={{ color: "#F5F5F2" }}>{site.hero.h1Pre}</span>
            <span style={{ color: "#B85CDB" }}>{site.hero.h1Accent}</span>
          </div>
          <div style={{ marginTop: 28, fontSize: 26, color: "rgba(245,245,242,0.7)" }}>{site.hero.subtitulo}</div>
          <div style={{ marginTop: 48, fontSize: 20, color: "#F5F5F2", letterSpacing: 5, textTransform: "uppercase" }}>{site.nombre}</div>
        </div>
      </div>
    ),
    size,
  );
}
