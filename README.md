# Alexis González · Método PROSPERA® — Landing

Landing de captación para la mentoría 1:1 Método PROSPERA®.
Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · GSAP + ScrollTrigger · Lenis · React Hook Form + Zod · Resend.

## Desarrollo

```bash
npm install
cp .env.example .env.local   # completar lo que corresponda
npm run dev
```

- `npm run build` · `npm run lint` · `npm test` (scoring con Vitest)
- Todo el copy, links y flags están en [`content/site.ts`](content/site.ts). Lo pendiente del cliente está marcado `TODO(cliente)`.
- `?motion=full` fuerza las animaciones completas aunque el sistema tenga “reducir movimiento” activado (útil para revisar en equipos con animaciones de Windows desactivadas).

## Estructura

- `app/` — página, API (`/api/apply`, `/api/ebook`), legales, OG, sitemap, robots
- `components/sections/` — las secciones en orden de lectura
- `components/layout/` — nav, menú mobile, preloader, cursor, sticky CTA, WhatsApp, exit intent, analítica/cookies
- `components/ui/` — sistema de componentes (Button, Card, Tag, Field, Chip, Wireframe…)
- `components/forms/` — `ApplyForm` (3 pasos + resultado) y `EbookForm`
- `lib/` — motion helpers, scoring, schemas, analytics, UTM, CRM, email

Ver [`NOTES.md`](NOTES.md) para decisiones técnicas, variables de entorno y la secuencia de nurturing.
