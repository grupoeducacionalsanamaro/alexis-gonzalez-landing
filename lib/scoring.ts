/**
 * Scoring de postulaciones (función pura). Umbrales exportados para
 * recalibrar tras las primeras 30 postulaciones.
 */
import { formOptions } from "@/content/site";

export type Segmento = "prioritario" | "calificado" | "nutrir";

export const UMBRAL_PRIORITARIO = 7;
export const UMBRAL_CALIFICADO = 4;
export const RESULTADO_DETALLADO_MIN = 120;

const [FACT_NO_FACTURA, FACT_MENOS_100, FACT_100_300, FACT_300_1000, FACT_MAS_1000] = formOptions.facturacion;
const [PERFIL_DUENO, , PERFIL_DIRECTOR, PERFIL_EMPLEADO] = formOptions.perfil;
const [INV_SI, INV_DEPENDE, INV_NO] = formOptions.inversion;

export const PUNTOS_FACTURACION: Record<string, number> = {
  [FACT_NO_FACTURA]: 0,
  [FACT_MENOS_100]: 0,
  [FACT_100_300]: 2,
  [FACT_300_1000]: 3,
  [FACT_MAS_1000]: 4,
};

export type ScoringInput = {
  perfil: readonly string[];
  facturacion: string;
  inversion: string;
  resultado: string;
};

export function calcularScore(input: ScoringInput): { score: number; segmento: Segmento } {
  let score = PUNTOS_FACTURACION[input.facturacion] ?? 0;
  if (input.perfil.includes(PERFIL_DUENO) || input.perfil.includes(PERFIL_DIRECTOR)) score += 1;
  if (input.inversion === INV_SI) score += 3;
  else if (input.inversion === INV_DEPENDE) score += 1;
  if (input.resultado.trim().length >= RESULTADO_DETALLADO_MIN) score += 1;

  // Regla dura: siempre nutrir (sin facturación relevante, sin presupuesto o sin negocio propio)
  const soloEmpleado = input.perfil.length > 0 && input.perfil.every((p) => p === PERFIL_EMPLEADO);
  if (input.facturacion === FACT_NO_FACTURA || input.facturacion === FACT_MENOS_100 || input.inversion === INV_NO || soloEmpleado) {
    return { score, segmento: "nutrir" };
  }

  const segmento: Segmento =
    score >= UMBRAL_PRIORITARIO ? "prioritario" : score >= UMBRAL_CALIFICADO ? "calificado" : "nutrir";
  return { score, segmento };
}
