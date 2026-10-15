import { z } from "zod";
import type { UseFormReturn } from "react-hook-form";
import { step1Schema, step2Schema, step3Schema } from "@/lib/schemas";

export const clientApplySchema = z.intersection(z.intersection(step1Schema, step2Schema), step3Schema.extend({ empresa_web: z.string().optional() }));
export type ApplyValues = z.input<typeof clientApplySchema>;
export type ApplyForm = UseFormReturn<ApplyValues>;

export const STEP_FIELDS: (keyof ApplyValues)[][] = [
  ["especialidad", "especialidadOtro", "facturacion", "equipo"],
  ["dolores", "objetivo", "compromiso"],
  ["nombre", "email", "whatsapp", "ciudad", "webOInstagram", "consentimiento"],
];

export type Resultado = { segmento: "prioritario" | "calificado" | "nutrir"; ebookUrl: string | null };
