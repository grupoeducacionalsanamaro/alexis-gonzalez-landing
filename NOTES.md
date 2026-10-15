# NOTES — decisiones y pendientes

## Decisiones técnicas (desviaciones del brief)

- **Next.js 16.4** (el brief pide 15+). Se desactivó `cacheComponents` del scaffold: la página es estática y no lo necesita.
- **H1 del hero**: el token `.t-display` (hasta 104px) no cabe en 6 columnas con una frase de 9 palabras. El H1 usa `clamp(34px, 5.2vw, 78px)` con el mismo estilo (Poppins 600, mayúsculas, −0.02em).
- **Retrato del hero**: la foto viene con fondo (evento). No se recortó con IA; se trata en B/N cálido con máscara CSS hacia la izquierda, degradado a negro y halo dorado. El B/N va **horneado en el archivo** (`alexis-hero-bw.webp`, generado con `node scripts/bake-photo-bw.mjs public/img/alexis-hero.webp public/img/alexis-hero-bw.webp`): un `filter` CSS sobre el elemento LCP retrasaba ~1s el primer frame en Chrome mobile. Si llega otra foto, reemplazar `alexis-hero.webp` y volver a correr el script.
- **Galería de autoridad**: 3 fotos (Harvard Business School, Faculty Club, conferencia). La 4.ª foto disponible (evento Acelerador) se usa como retrato de “¿Quién soy?”.
- **Mockup del ebook**: construido en CSS 3D (tapa, lomo, páginas) con el título real, en vez de usar la imagen con fondo blanco. Cuando exista la portada final en alta, puede reemplazarse el contenido de la tapa.
- **Framer Motion**: no se usa. Las microinteracciones van en CSS y las transiciones de pasos del formulario con Web Animations API (más liviano).
- **SplitText**: split propio por líneas en `lib/animations.ts` (conserva el texto accesible con un `span.sr-only`).
- **Reduced motion**: el script de `<head>` agrega la clase `rm` si el sistema pide menos movimiento. Con `rm` se desactivan pin, scrub, parallax, marquee, cursor, tilt y preloader; todo pasa a fades de 200ms. **`?motion=full` fuerza la versión completa** (queda guardado en la sesión) para revisión interna.
- **Preloader**: solo primera visita de la sesión, en desktop con puntero fino y sin reduced motion (en mobile no retrasa el LCP).
- **LCP**: el retrato del hero nunca se oculta con opacidad (entra con transform + blur), para no retrasar el LCP.
- **Primer frame en Chrome mobile (Lighthouse)**: Chrome asigna un nuevo `LocalSurfaceId` justo después de navegar; si el primer commit del renderer se atrasa (layout largo), viz deja de pedirle frames durante ~1s y el FCP/LCP observado se va a ~1.5s. Para que el primer layout sea corto: en mobile las secciones bajo el pliegue usan `content-visibility: auto` (alturas aproximadas en `globals.css`; `#postular` y `#testimonios` quedan fuera por sus overlays `fixed`).
- **Fuentes**: se precargan solo Poppins 500/600 e Inter. Poppins 700 itálica (citas, tapa del ebook) es un loader aparte sin preload (`--font-quote` / clase `font-quote`).
- **Carga de motion**: los setups de GSAP (cada `useMotion` y el orquestador, en lotes de 4 elementos) corren en tareas separadas vía `queueMotion()` para no generar una tarea larga al llegar GSAP (TBT).
- **Wireframes**: sin `vector-effect: non-scaling-stroke` porque rompe el dibujo por `stroke-dashoffset`; el grosor se ajusta con la prop `strokeWidth`.
- **Rate limit**: en memoria por instancia (5/min por IP). Para algo robusto usar Vercel Firewall / Upstash.
- **Banner de cookies**: solo aparece si hay al menos un ID de analítica configurado. GTM, Pixel y Clarity se cargan únicamente tras “Aceptar”.
- **Formulario mobile**: el CTA “Comenzar postulación” abre un overlay a pantalla completa; en desktop el formulario va embebido en la card.
- **Agenda**: si `NEXT_PUBLIC_BOOKING_URL` no existe, el resultado calificado muestra un mensaje de contacto por WhatsApp en vez del calendario.

## Variables de entorno

Ver `.env.example`. Todas degradan con elegancia: sin `CRM_WEBHOOK_URL` el payload se registra en consola (dev); sin `RESEND_API_KEY` no se envían emails; sin `NEXT_PUBLIC_WHATSAPP_NUMBER` el botón no aparece; sin `EBOOK_PDF_URL` no hay botón de descarga directa.

Para Resend, verificar el dominio remitente y definir `RESEND_FROM` (por defecto usa `onboarding@resend.dev`, que solo envía al dueño de la cuenta).

## Payload al CRM

```json
{ "tipo": "postulacion|ebook", "estado": "completa|incompleta", "score": 8, "segmento": "prioritario",
  "respuestas": { ... }, "utm": { "source": "", "medium": "", "campaign": "", "content": "", "term": "", "gclid": "", "fbclid": "" },
  "landing": "/", "dispositivo": "mobile|desktop", "timestamp": "ISO" }
```

Las postulaciones incompletas se envían cuando el email del paso 3 es válido (`/api/apply?partial=1`).

## Scoring (`lib/scoring.ts`)

| Criterio | Puntos |
| --- | --- |
| Facturación 100–300M / 300M–1.000M / >1.000M | 2 / 3 / 4 |
| Equipo 6–20 o >20 | 1 |
| Compromiso “listo ahora” / “próximos 3 meses” | 3 / 1 |
| Objetivo ≥ 120 caracteres | 1 |

≥7 prioritario · 4–6 calificado · <4 nutrir. Regla dura: <100M o “Solo estoy explorando” → nutrir. Recalibrar tras 30 postulaciones.

## Secuencia de nurturing (configurar en el CRM)

| Día | Canal | Contenido |
| --- | --- | --- |
| 0 | Email | Entrega del ebook + quién es Alexis en 3 líneas |
| 1 | WhatsApp | “¿Te llegó el ebook?” |
| 3 | Email | El error más caro: que el negocio dependa de ti |
| 5 | Email | Las 3 dimensiones de PROSPERA (vida, carrera, negocio) |
| 7 | Email | Episodio recomendado del podcast CEOS |
| 10 | Email | Caso o testimonio de un mentorado (cuando existan) |
| 14 | Email + WhatsApp | Invitación directa a postular |

Recuperación: incompleto → email 1h + WhatsApp 24h · calificado sin agenda → 24h y 72h · agendado → recordatorios 24h y 1h.

Pipeline: Nuevo → Calificado → Agendado → Diagnóstico realizado → Propuesta → Mentorado / Perdido.

## Pendientes del cliente (`TODO(cliente)` en `content/site.ts`)

- Retrato hero en alta (ideal fondo neutro) y fotos de galería en alta.
- 3–5 testimonios reales (activar `flags.showTestimonios`).
- Duración del programa, modalidad e inversión (o decisión de no mostrarla).
- Respuestas de FAQ (las preguntas sin respuesta no se muestran).
- PDF final del ebook (`EBOOK_PDF_URL`) y portada en alta.
- Links de podcasts, redes, email de contacto y número de WhatsApp.
- Confirmar ® o ™ en PROSPERA (`marca` en `content/site.ts`) y validar cifras de “¿Quién soy?”.
- Dominio definitivo (`NEXT_PUBLIC_SITE_URL`) y datos del responsable para la política de privacidad (revisar con abogado).
- HEX oficiales si existe manual de marca.

## QA pendiente

- Lighthouse mobile ≥ 90 en el deploy real.
- Prueba del formulario en iPhone y Android reales, con webhook de prueba (p. ej. webhook.site) y Resend configurado.
- Verificar eventos en GA4 / Meta una vez configurados los IDs.
