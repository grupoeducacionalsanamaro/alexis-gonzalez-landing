/**
 * Fuente única de copy, links y flags de la landing.
 * Todo lo marcado con `TODO(cliente)` está pendiente de validación por Alexis.
 * Nunca hardcodear texto en los componentes: se edita aquí.
 */

export const marca = "PROSPERA®"; // TODO(cliente): cambiar a "PROSPERA™" si el registro está en trámite

export type FaqItem = { pregunta: string; respuesta: string | null };
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
      { label: "Sobre mí", href: "#sobre-mi" },
      { label: "Ecosistema", href: "#ecosistema" },
      { label: "Eventos", href: "#eventos" },
      { label: "Servicios", href: "#servicios" },
      { label: "Mentoría", href: "#metodo" },
    ],
    cta: "Postular",
    ctaMobile: "Postular a la mentoría",
  },

  hero: {
    eyebrow: "Alexis González · MBA · Mentor estratégico",
    // “Es mejor ser próspero que exitoso.” — próspero en sólido, exitoso en contorno
    h1Pre: "Es mejor ser",
    h1Destacado: "próspero",
    h1Medio: "que",
    h1Contraste: "exitoso",
    h1Cierre: ".", // punto sólido (no en contorno)
    cta: "Conoce más",
    ctaHref: "#sobre-mi",
    imagen: "/img/alexis-hero-v3.webp",
    imagenAlt: "Alexis González de chaqueta clara frente a un panel púrpura, junto a una foto de él dando una charla",
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

  sobre: {
    eyebrow: "Sobre Alexis",
    nombre: "Alexis González",
    rol: "MBA · Emprendedor · Mentor Estratégico",
    bio: [
      "Empresario con más de 10 años de experiencia creando y desarrollando marcas, negocios y proyectos vinculados a la formación continua de profesionales de la salud.",
      "MBA y especialista en marketing aplicado al sector salud. A lo largo de su trayectoria ha complementado su formación con programas ejecutivos y experiencias de negocios en Chile, Argentina, Brasil, España, Estados Unidos y Ecuador.",
    ],
    formacionTitulo: "Su formación ha incluido áreas como:",
    formacion: [
      "Habilidades Directivas",
      "Delegación",
      "Transformación y Mentoring",
      "Negociación y Persuasión",
      "Comunicación",
      "Estrategia",
      "Aceleración Empresarial",
    ],
    bio2: [
      "Ha construido empresas y patrimonio desde cero, experiencia que hoy integra en su trabajo como mentor estratégico de profesionales y dueños de pequeñas y medianas empresas.",
      "Reside en Concepción, Chile, desde donde lidera sus negocios priorizando una filosofía que combina crecimiento, patrimonio, tiempo y calidad de vida.",
    ],
    filosofiaIntro: "Su filosofía se resume en una idea que guía tanto su vida como sus negocios:",
    filosofia: "Es mejor ser próspero que exitoso.",
    filosofiaCierre:
      "Porque para Alexis, crecer no significa únicamente facturar más. Significa también avanzar en libertad, familia, experiencias, aprendizaje y propósito.",
    // Foto junto a la bio: 1080×1350 (4:5), servida tal cual
    foto: {
      src: "/img/alexis-quien-es.webp" as string | null,
      alt: "Alexis González de traje claro, sentado sobre un sillón revisando unos documentos",
    },
    carruselTitulo: "Programas y experiencias a los que he asistido",
    carrusel: [
      { titulo: "Acelerador Empresarial", lugar: "Brasil", src: "/img/alexis-retrato.webp" as string | null },
      { titulo: "Harvard Business School", lugar: "Boston, Estados Unidos", src: "/img/galeria-hbs.webp" as string | null },
      { titulo: "ESE Business School", lugar: "Chile", src: "/img/programa-ese.webp" as string | null },
      { titulo: "IDE Business School", lugar: "Ecuador", src: "/img/programa-ide.webp" as string | null },
      { titulo: "Faculty Club · Harvard", lugar: "Boston, Estados Unidos", src: "/img/galeria-faculty-club.webp" as string | null },
    ],
    paises: ["Chile", "Argentina", "Brasil", "España", "Estados Unidos", "Ecuador"],
    documental: {
      eyebrow: "Documental",
      titulo: "La historia detrás del empresario",
      youtubeId: "_wNDXhQ4a84",
    },
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
    antetitulo: "Espera un poco, aún hay más...",
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
    eyebrow: "Ecosistema",
    titulo: "Marcas, comunidades y experiencias que lidero",
    // Logos en /public/logos (recortados y exportados desde “Logos Marcas”)
    grupos: [
      {
        nombre: "Área educacional",
        destacado: "Grupo Educacional San Amaro" as string | null,
        destacadoLogo: "/logos/san-amaro.webp" as string | null,
        marcas: [
          { nombre: "AGC Instituto de Odontología", logo: "/logos/agc.webp" as string | null },
          { nombre: "Harmony Institute Internacional", logo: "/logos/harmony-institute.webp" as string | null },
          { nombre: "Simetría Academia", logo: "/logos/simetria.webp" as string | null },
          { nombre: "KONCEPTO Instituto de Formación", logo: "/logos/koncepto.webp" as string | null },
          { nombre: "Premier Medical Institute", logo: "/logos/premier.webp" as string | null },
        ],
      },
      {
        nombre: "Comunidades, medios y desarrollo profesional",
        destacado: null as string | null,
        destacadoLogo: null as string | null,
        marcas: [
          { nombre: "Círculo Society", logo: "/logos/circulo-society.webp" as string | null },
          { nombre: "ORO Magazine", logo: "/logos/oro-magazine.webp" as string | null },
          { nombre: "Emplea Dental", logo: "/logos/emplea-dental.webp" as string | null },
          { nombre: "EmpleaSalud", logo: "/logos/emplea-salud.webp" as string | null },
        ],
      },
      {
        nombre: "Eventos y experiencias",
        destacado: null as string | null,
        destacadoLogo: null as string | null,
        marcas: [
          { nombre: "Momentum", logo: "/logos/momentum.webp" as string | null },
          { nombre: "Level Up", logo: "/logos/level-up.webp" as string | null },
          { nombre: "ICONS Dental Congress", logo: "/logos/icons.webp" as string | null },
          { nombre: "Harmony On Tour", logo: "/logos/harmony-on-tour.webp" as string | null },
          { nombre: "Next", logo: "/logos/next.webp" as string | null },
        ],
      },
    ],
  },

  contenido: {
    eyebrow: "Eventos y contenido",
    titulo: "Escenarios, conversaciones y comunidad",
    // La primera va como banda ancha (foto grupal completa); las demás en 4:3
    eventos: [
      { titulo: "Momentum", src: "/img/evento-momentum.webp" as string | null, alt: "Foto grupal del congreso Momentum frente al escenario" },
      { titulo: "CEOs Podcast", src: "/img/evento-ceos-podcast.webp" as string | null, alt: "Alexis González grabando el podcast CEOs con dos invitados" },
      { titulo: "Harmony On Tour Concepción", src: "/img/evento-harmony-on-tour.webp" as string | null, alt: "Alexis González con dos asistentes en Harmony On Tour Concepción" },
      { titulo: "Workshop El Círculo Sessions", src: "/img/evento-workshop-circulo.webp" as string | null, alt: "Alexis González presentando frente a un auditorio en El Círculo Sessions" },
      { titulo: "Workshop Establecimiento de metas", src: "/img/evento-workshop-metas.webp" as string | null, alt: "Alexis González dictando el workshop de establecimiento de metas en una sala" },
    ],
    podcastsEyebrow: "Podcasts",
    podcastsTitulo: "CEOs y El Círculo Sessions",
    podcastsBajada: "Conversaciones con empresarios y líderes sobre negocios, crecimiento y calidad de vida.",
    podcastsFoto: "/img/podcast-alexis.webp",
    podcasts: [
      {
        nombre: "CEOs Podcast",
        detalle: "Conversaciones con líderes y empresarios.",
        logo: "/logos/podcast-ceos.webp",
        logoFondo: "claro" as "claro" | "oscuro", // el logo es púrpura con texto negro
        links: [
          { plataforma: "spotify" as const, label: "Spotify", href: "https://open.spotify.com/show/2m65GqevB03AKwCJ4jc27P" },
          // TODO(cliente): el link de YouTube llegó cortado (los IDs de lista suelen tener 34 caracteres); confirmar
          { plataforma: "youtube" as const, label: "YouTube", href: "https://www.youtube.com/playlist?list=PLTMVo0qOQ-WM" },
        ],
      },
      {
        nombre: "El Círculo Sessions",
        detalle: "Negocios, salud y visión de largo plazo.",
        logo: "/logos/podcast-circulo-sessions.webp",
        logoFondo: "oscuro" as "claro" | "oscuro", // logo dorado
        links: [] as { plataforma: "spotify" | "youtube"; label: string; href: string }[], // TODO(cliente): links de Spotify/YouTube
      },
    ],
    spotify: "https://open.spotify.com/show/2m65GqevB03AKwCJ4jc27P",
  },

  servicios: {
    eyebrow: "Servicios",
    titulo: "Inspírese y acceda a los resultados que merece",
    items: [
      {
        tipo: "Conferencia",
        detalle: "Charlas en escenario sobre crecimiento, patrimonio y negocios en salud.",
        src: null as string | null, // TODO(cliente): foto potente en escenario (ej. Momentum)
        cta: "Solicitar conferencia",
        href: null as string | null, // sin link: abre WhatsApp si está configurado
      },
      {
        tipo: "Workshop",
        detalle: "Talleres prácticos para equipos y programas de postgrado.",
        src: null as string | null, // TODO(cliente): foto dando taller en postgrado
        cta: "Solicitar workshop",
        href: null as string | null,
      },
      {
        tipo: "Mentoría estratégica",
        detalle: "Dirección estratégica 1:1 para ordenar vida, carrera y negocio.",
        src: null as string | null,
        cta: "Postula a la mentoría",
        href: "https://forms.gle/RMTngRBZ8TRS5cj46" as string | null,
      },
    ],
    brochureCta: "Descargar servicios",
    brochureHref: "https://docs.google.com/document/d/1obyJ7tUYH6kdAGQr3cIdJk2f0uMQsmRDZxIdox8r24o/edit?usp=sharing",
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
    redesTitulo: "Sígueme",
    redes: [
      { label: "LinkedIn", handle: "alexisgonzalezc", href: "https://www.linkedin.com/in/alexisgonzalezc/" },
      { label: "Instagram", handle: "@alexis.gonzalezagc", href: "https://www.instagram.com/alexis.gonzalezagc/" },
      { label: "Spotify", handle: "Podcast", href: "https://open.spotify.com/show/2m65GqevB03AKwCJ4jc27P" },
    ],
    email: null as string | null, // TODO(cliente)
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
