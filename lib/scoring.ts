/**
 * Scoring de postulaciones (función pura). Umbrales exportados para
 * recalibrar tras las primeras 30 postulaciones.
 */
import { formOptions } from "@/content/site";

export type Segmento = "prioritario" | "calificado" | "nutrir";

export const UMBRAL_PRIORITARIO = 7;
export const UMBRAL_CALIFICADO = 4;
export const OBJETIVO_DETALLADO_MIN = 120;

const [FACT_MENOS_100, FACT_100_300, FACT_300_1000, FACT_MAS_1000] = formOptions.facturacion;
const [, , EQUIPO_6_20, EQUIPO_MAS_20] = formOptions.equipo;
const [COMP_AHORA, COMP_3_MESES, COMP_EXPLORANDO] = formOptions.compromiso;

export const PUNTOS_FACTURACION: Record<string, number> = {
  [FACT_MENOS_100]: 0,
  [FACT_100_300]: 2,
  [FACT_300_1000]: 3,
  [FACT_MAS_1000]: 4,
};

export type ScoringInput = {
  facturacion: string;
  equipo: string;
  compromiso: string;
  objetivo: string;
};

export function calcularScore(input: ScoringInput): { score: number; segmento: Segmento } {
  let score = PUNTOS_FACTURACION[input.facturacion] ?? 0;
  if (input.equipo === EQUIPO_6_20 || input.equipo === EQUIPO_MAS_20) score += 1;
  if (input.compromiso === COMP_AHORA) score += 3;
  else if (input.compromiso === COMP_3_MESES) score += 1;
  if (input.objetivo.trim().length >= OBJETIVO_DETALLADO_MIN) score += 1;

  // Regla dura: siempre nutrir
  if (input.facturacion === FACT_MENOS_100 || input.compromiso === COMP_EXPLORANDO) {
    return { score, segmento: "nutrir" };
  }

  const segmento: Segmento =
    score >= UMBRAL_PRIORITARIO ? "prioritario" : score >= UMBRAL_CALIFICADO ? "calificado" : "nutrir";
  return { score, segmento };
}
