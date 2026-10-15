import { z } from "zod";
import { formOptions } from "@/content/site";

const enumOf = <T extends readonly [string, ...string[]]>(vals: T, msg: string) =>
  z.enum(vals, { error: () => msg });

/** Celular chileno: 9 dígitos comenzando en 9 (sin +56). */
export const phoneCL = z
  .string()
  .transform((v) => v.replace(/\D/g, "").replace(/^56/, ""))
  .refine((v) => /^9\d{8}$/.test(v), "Ingresa un celular válido: 9 XXXX XXXX");

export const utmSchema = z
  .object({
    source: z.string().max(200).optional(),
    medium: z.string().max(200).optional(),
    campaign: z.string().max(200).optional(),
    content: z.string().max(200).optional(),
    term: z.string().max(200).optional(),
    gclid: z.string().max(300).optional(),
    fbclid: z.string().max(300).optional(),
  })
  .partial();

export const step1Schema = z
  .object({
    especialidad: enumOf(formOptions.especialidad, "Elige tu especialidad"),
    especialidadOtro: z.string().trim().max(80).optional(),
    facturacion: enumOf(formOptions.facturacion, "Elige un rango de facturación"),
    equipo: enumOf(formOptions.equipo, "Elige el tamaño de tu equipo"),
  })
  .refine((d) => d.especialidad !== "Otro" || (d.especialidadOtro && d.especialidadOtro.length >= 2), {
    path: ["especialidadOtro"],
    message: "Cuéntanos tu especialidad",
  });

export const step2Schema = z.object({
  dolores: z.array(enumOf(formOptions.dolores, "Opción inválida")).min(1, "Elige al menos una opción"),
  objetivo: z
    .string()
    .trim()
    .min(10, "Escribe al menos 10 caracteres")
    .max(400, "Máximo 400 caracteres"),
  compromiso: enumOf(formOptions.compromiso, "Elige tu nivel de compromiso"),
});

export const step3Schema = z.object({
  nombre: z.string().trim().min(2, "Ingresa tu nombre").max(80),
  email: z.string().trim().toLowerCase().email("Ingresa un email válido").max(120),
  whatsapp: phoneCL,
  ciudad: z.string().trim().min(2, "Ingresa tu ciudad").max(60),
  webOInstagram: z.string().trim().max(120).optional().or(z.literal("")),
  consentimiento: z.literal(true, { error: () => "Debes aceptar la política de privacidad" }),
});

/** Campos de control anti-bot + tracking, comunes a ambos formularios. */
const metaSchema = z.object({
  empresa_web: z.string().max(0).optional().or(z.literal("")), // honeypot: debe venir vacío
  startedAt: z.number().int().positive(),
  eventId: z.string().max(80).optional(),
  utm: utmSchema.optional(),
  landing: z.string().max(300).optional(),
});

export const applySchema = z.intersection(
  z.intersection(z.intersection(step1Schema, step2Schema), step3Schema),
  metaSchema,
);
export type ApplyInput = z.input<typeof applySchema>;
export type ApplyData = z.output<typeof applySchema>;

/** Envío parcial (recuperación): solo exige email válido, el resto opcional. */
export const applyPartialSchema = z
  .object({
    email: z.string().trim().toLowerCase().email().max(120),
    nombre: z.string().trim().max(80).optional(),
    whatsapp: z.string().max(20).optional(),
    especialidad: z.string().max(80).optional(),
    facturacion: z.string().max(40).optional(),
    equipo: z.string().max(40).optional(),
    compromiso: z.string().max(80).optional(),
  })
  .and(metaSchema.partial());

export const ebookSchema = z
  .object({
    nombre: z.string().trim().min(2, "Ingresa tu nombre").max(80),
    email: z.string().trim().toLowerCase().email("Ingresa un email válido").max(120),
    whatsapp: phoneCL,
    consentimiento: z.literal(true, { error: () => "Debes aceptar la política de privacidad" }),
  })
  .and(metaSchema);
export type EbookInput = z.input<typeof ebookSchema>;

export const MIN_FILL_MS = 4000;
