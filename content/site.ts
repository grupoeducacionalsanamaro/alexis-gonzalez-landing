/**
 * Fuente única de copy, links y flags de la landing.
 * Todo lo marcado con `TODO(cliente)` está pendiente de validación por Alexis.
 * Nunca hardcodear texto en los componentes: se edita aquí.
 */

export const marca = "PROSPERA®"; // TODO(cliente): cambiar a "PROSPERA™" si el registro está en trámite

export type FaqItem = { pregunta: string; respuesta: string | null };
export type EcoItem = { titulo: string; detalle: string; href: string | null };
export type Testimonio = {
  nombre: string;
  especialidad: string;
  cita: string;
  resultado: string;
  foto: string | null;
  video: string | null;
};

export const site = {
  marca,
  nombre: "Alexis González",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://alexisgonzalez.cl", // TODO(cliente): dominio definitivo

  flags: {
    showTestimonios: false, // TODO(cliente): activar solo con testimonios reales
    showPreloader: true,
    showCursor: true,
    showExitIntent: true,
  },

  seo: {
    title: `Alexis González · Mentoría Método ${marca} para empresarios de la salud`,
    description: `Mentoría 1:1 para profesionales y empresarios de la salud que facturan sobre 100 millones. Ordena tu vida, tu carrera y tu negocio con el Método ${marca}.`,
  },

  nav: {
    links: [
      { label: "Método", href: "#metodo" },
      { label: "Mentoría", href: "#mentoria" },
      { label: "Sobre mí", href: "#sobre-mi" },
      { label: "Ebook", href: "#ebook" },
    ],
    cta: "Postular",
    ctaMobile: "Postular a la mentoría",
  },

  hero: {
    eyebrow: `Mentoría 1:1 · Método ${marca}`,
    h1Pre: "Si tu negocio depende de ti,",
    h1Accent: "no tienes un negocio.",
    subtitulo: "Tienes un empleo caro.",
    bajada:
      "Dirección estratégica para profesionales y empresarios de la salud que facturan sobre 100 millones al año.",
    ctaPrimario: "Postular a la mentoría",
    ctaSecundario: "Descargar ebook gratis",
    microPrueba: "MBA · +10 años construyendo ecosistemas en salud",
    // B/N horneado en el archivo (scripts/bake-photo-bw.mjs); el original en color es alexis-hero.webp
    imagen: "/img/alexis-hero.webp",
    imagenAlt: "Alexis González, mentor de negocios, dictando una charla frente a un auditorio",
    videoSrc: null as string | null, // TODO(cliente): loop MP4/WebM ≤2MB si se produce
  },

  diagnostico: {
    tituloPre: "Facturas más de",
    tituloNumero: 100,
    tituloPost: "millones al año…",
    bajada: "pero tu vida y tu negocio no están estructurados.",
    sintomas: [
      "Trabajas demasiado.",
      "Decides solo.",
      "Tu empresa depende de ti.",
      "No tienes claridad financiera real.",
      "No tienes plan a 3–5 años.",
    ],
    rematePre: "Facturar no es lo mismo que",
    remateAccent: "prosperar.",
  },

  dimensiones: {
    intro: `La mentoría Método ${marca} está diseñada para profesionales y empresarios del área salud que necesitan orden estratégico en tres dimensiones:`,
    items: [
      {
        palabra: "Vida",
        descripcion: "Orden personal, claridad de visión, energía y foco.",
        wireframe: "cube" as const,
      },
      {
        palabra: "Carrera",
        descripcion: "Posicionamiento profesional, decisiones estratégicas y proyección real.",
        wireframe: "prism" as const,
      },
      {
        palabra: "Negocio",
        descripcion: "Modelo de ingresos, estructura financiera, delegación y crecimiento sostenible.",
        wireframe: "stack" as const,
      },
    ],
  },

  quienSoy: {
    tag: "¿Quién soy?",
    saludoPre: "Soy",
    saludoNombre: "Alexis González.",
    bio: [
      "MBA | Inversionista inmobiliario (oficinas, departamentos y parcelas).",
      "He realizado programas de formación en Chile, Brasil, España y Estados Unidos.",
      "Fundador de un ecosistema educacional en el área de la salud, con más de 10 años creando estructura académica, comunidades y modelos de negocio.",
    ],
    badge: "Creador del Método",
    cierre: "Host del podcast CEOS, El Círculo Sessions y creador de eventos memorables.",
    imagen: "/img/alexis-retrato.webp",
    imagenAlt: "Alexis González con los brazos cruzados en un evento empresarial",
    // TODO(cliente): validar cifras
    cifras: [
      { prefijo: "+", valor: 10, sufijo: "", label: "años en el ecosistema salud" },
      { prefijo: "", valor: 4, sufijo: "", label: "países con programas de formación" },
      { prefijo: "", valor: 1, sufijo: "", label: "ecosistema educacional propio" },
    ],
    galeria: [
      {
        src: "/img/galeria-hbs.webp",
        alt: "Alexis González frente a Harvard Business School",
        pie: "Harvard Business School · Boston",
      },
      {
        src: "/img/galeria-faculty-club.webp",
        alt: "Alexis González de traje frente al Faculty Club de Harvard",
        pie: "Faculty Club · Harvard",
      },
      {
        src: "/img/galeria-conferencia.webp",
        alt: "Alexis González dictando una conferencia frente a un auditorio",
        pie: "Conferencia · Formación empresarial en salud",
      },
    ],
    marquee: [
      "Chile",
      "Brasil",
      "España",
      "Estados Unidos",
      "Harvard Business School",
      "Podcast CEOS",
      "El Círculo Sessions",
    ],
  },

  metodo: {
    tag: `Método ${marca}`,
    titulo: "Orden estratégico en tres dimensiones.",
    remateTachado: "No es coaching emocional.",
    remate: "Es dirección estratégica personalizada.",
  },

  paraQuien: {
    tag: "¿Para quién es esta mentoría?",
    si: [
      "Profesionales de la salud que facturan sobre 100 millones anuales.",
      "Dueños de pequeñas y medianas empresas.",
      "Empresarios que quieren escalar.",
      "Personas que quieren prosperar sin destruir su vida personal.",
    ],
    ctaTexto: "¿Te reconoces? Postula",
    noTitulo: "No es para:",
    no: [
      "Quien busca soluciones rápidas.",
      "Quien no ejecuta.",
      "Quien no está dispuesto a revisar su estructura.",
    ],
  },

  mentoria: {
    titulo: "La mentoría",
    badge: "Modalidad 1:1",
    etapas: [
      { titulo: "Sesión de diagnóstico inicial", detalle: "Radiografía de tu vida, carrera y negocio." },
      { titulo: "Sesiones estratégicas quincenales", detalle: "Decisiones concretas, prioridades y plan." },
      { titulo: "Seguimiento continuo", detalle: "Acompañamiento entre sesiones para ejecutar." },
    ],
    duracionPrograma: null as string | null, // TODO(cliente): "6 meses", etc.
  },

  testimonios: [] as Testimonio[], // TODO(cliente): 3–5 testimonios reales. Prohibido inventar.

  postulacion: {
    titulo: "Para postular debes completar el formulario de aplicación.",
    evaluacionTitulo: "La evaluación considera:",
    evaluacion: [
      "Facturación anual",
      "Estructura actual del negocio",
      "Nivel de compromiso",
      "Objetivos a 3–5 años",
    ],
    siCumples: "Si cumples con el perfil, coordinaremos una conversación estratégica inicial.",
    cuposTexto: null as string | null, // TODO(cliente): ej. "Cupos limitados por trimestre" solo si es real
    nota: "Mentoría dirigida exclusivamente a profesionales y empresarios de pequeñas y medianas empresas.",
    ctaAbrir: "Comenzar postulación",
  },

  ebook: {
    titulo: "De Clínico a Empresario",
    tituloPortada: ["De gran clínico", "a empresario"],
    subtituloPortada: "Guía rápida para escalar tu impacto profesional y empresarial",
    bajada: "Un mini ebook que puede ayudarte a dar el paso de gran clínico a empresario.",
    reflexionPre: "Si aún estás en etapa de reflexión,",
    reflexionBold: "descarga gratis",
    reflexionPost: "y entiende en qué segmento estás.",
    cta: "¡Descarga aquí!",
    formCta: "Recibir el ebook",
    exitoTitulo: "Tu ebook está listo.",
    exitoEmail: "También te lo enviamos a tu email.",
    exitoDescargar: "Descargar PDF",
    exitoPostular: "¿Listo para el siguiente paso? Postula a la mentoría",
  },

  ecosistema: {
    titulo: "Ecosistema",
    bajada: "Además de la mentoría, lidero:",
    items: [
      { titulo: "Podcast CEOS", detalle: "Conversaciones con líderes y empresarios.", href: null },
      { titulo: "Podcast El Círculo Sessions", detalle: "Negocios, salud y visión de largo plazo.", href: null },
      { titulo: "El Círculo", detalle: "Eventos y negocios.", href: null },
      { titulo: "Comunidad de empresarios de la salud", detalle: "Desarrollo de comunidad y redes de colaboración.", href: null },
      { titulo: "Grupo Educacional San Amaro", detalle: "Formación académica en el área de la salud.", href: "https://sanamaro.cl" },
      { titulo: "Clínicas de cirugía y medicina estética", detalle: "Modelos de negocio clínico en operación.", href: null },
    ] as EcoItem[], // TODO(cliente): links de podcasts (Spotify/YouTube) y El Círculo
  },

  faq: {
    titulo: "Preguntas frecuentes",
    items: [
      { pregunta: "¿Cuánto dura la mentoría?", respuesta: null },
      { pregunta: "¿Es presencial u online?", respuesta: null },
      { pregunta: "¿Cuál es la inversión?", respuesta: null },
      {
        pregunta: "¿Qué pasa si no califico?",
        // TODO(cliente): validar redacción
        respuesta:
          "No hay un rechazo. Si hoy tu negocio no está en la etapa que la mentoría requiere, te enviamos el ebook “De Clínico a Empresario” y contenido para que avances. Cuando estés listo, puedes volver a postular.",
      },
      { pregunta: "¿Cuánto tiempo semanal requiere?", respuesta: null },
    ] as FaqItem[], // TODO(cliente): completar respuestas; las `null` no se muestran
  },

  ctaFinal: {
    lineas: [
      "Si tu negocio depende completamente de ti, no tienes un negocio.",
      "Tienes un autoempleo bien pagado.",
    ],
    lineas2: ["La pregunta no es si quieres crecer.", "La pregunta es si estás dispuesto a"],
    palabraFinal: "estructurarte.",
    cta: "Aplicar ahora",
  },

  footer: {
    tagline: `Alexis González · Método ${marca}`,
    // TODO(cliente): links reales de redes, podcasts y email
    redes: [
      { label: "Instagram", href: null as string | null },
      { label: "LinkedIn", href: null as string | null },
      { label: "YouTube", href: null as string | null },
      { label: "Podcast CEOS", href: null as string | null },
    ],
    email: null as string | null,
  },

  applyForm: {
    pasos: ["Tu negocio", "Tu situación", "Tus datos"],
    labels: {
      especialidad: "Especialidad o rubro",
      especialidadOtro: "¿Cuál?",
      facturacion: "Facturación anual (CLP)",
      equipo: "Tamaño de tu equipo",
      dolores: "¿Qué te preocupa más hoy?",
      objetivo: "¿Dónde quieres estar en 3 a 5 años?",
      compromiso: "Nivel de compromiso",
      nombre: "Nombre y apellido",
      email: "Email",
      whatsapp: "WhatsApp",
      ciudad: "Ciudad",
      webOInstagram: "Instagram o web (opcional)",
      consentimientoPre: "Acepto el tratamiento de mis datos según la",
      consentimientoLink: "Política de privacidad",
    },
    atras: "Atrás",
    continuar: "Continuar",
    enviar: "Enviar postulación",
    retomarTitulo: "Tienes una postulación en curso.",
    retomar: "Retomar postulación",
    empezar: "Empezar de nuevo",
    errorEnvio: "No pudimos enviar tu postulación. Revisa tu conexión e intenta nuevamente.",
    resultado: {
      calificadoEyebrow: "Postulación recibida",
      calificadoTitulo: "Tu postulación cumple con el perfil.",
      calificadoBajada: "Agenda ahora tu conversación estratégica inicial con Alexis.",
      sinAgenda: "Te contactaremos por WhatsApp dentro de las próximas 24 horas hábiles para coordinar tu conversación estratégica inicial.",
      nutrirEyebrow: "Gracias por postular",
      nutrirTitulo: "Por ahora, el mejor siguiente paso es este.",
      nutrirBajada:
        "Según tus respuestas, hoy te servirá más ordenar las bases. Te dejamos el ebook “De Clínico a Empresario” para identificar en qué etapa estás. Cuando estés listo, vuelve a postular.",
      nutrirEbook: "Descargar ebook gratis",
      nutrirPodcast: "Escuchar el podcast",
    },
  },

  whatsapp: {
    mensaje: "Hola Alexis, quiero saber más sobre la mentoría PROSPERA.",
  },

  exitIntent: {
    eyebrow: "Antes de irte",
    titulo: "Llévate el ebook gratis.",
    bajada: "“De Clínico a Empresario”: entiende en qué etapa está tu negocio y cuál es el siguiente paso.",
  },

  cookies: {
    texto: "Usamos cookies para medir y mejorar esta página. Puedes aceptar todas o solo las necesarias.",
    aceptar: "Aceptar",
    rechazar: "Solo necesarias",
  },

  legal: {
    responsable: "Alexis González", // TODO(cliente): razón social y RUT del responsable del tratamiento
    contacto: "contacto@alexisgonzalez.cl", // TODO(cliente): email real de contacto
  },
};

/** Opciones del formulario de postulación (compartidas cliente/servidor). */
export const formOptions = {
  especialidad: ["Medicina", "Odontología", "Estética", "Kinesiología", "Clínica o centro de salud", "Otro"],
  facturacion: ["Menos de 100M", "100–300M", "300M–1.000M", "Más de 1.000M"],
  equipo: ["Solo yo", "2–5", "6–20", "Más de 20"],
  dolores: [
    "Mi negocio depende de mí",
    "Desorden financiero",
    "Falta de tiempo",
    "No sé cómo escalar",
    "Mi vida personal",
  ],
  compromiso: [
    "Estoy listo para invertir tiempo y recursos ahora",
    "En los próximos 3 meses",
    "Solo estoy explorando",
  ],
} as const;
