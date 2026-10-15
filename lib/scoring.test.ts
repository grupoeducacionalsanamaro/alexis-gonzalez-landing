import { describe, expect, it } from "vitest";
import { formOptions } from "@/content/site";
import { calcularScore, OBJETIVO_DETALLADO_MIN } from "./scoring";

const [F0, F100, F300, F1000] = formOptions.facturacion;
const [E1, E2, E6, E20] = formOptions.equipo;
const [C_AHORA, C_3M, C_EXPL] = formOptions.compromiso;
const corto = "Quiero ordenar mi clínica.";
const largo = "x".repeat(OBJETIVO_DETALLADO_MIN);

describe("calcularScore", () => {
  it("máximo puntaje → prioritario (4+1+3+1 = 9)", () => {
    expect(calcularScore({ facturacion: F1000, equipo: E20, compromiso: C_AHORA, objetivo: largo })).toEqual({
      score: 9,
      segmento: "prioritario",
    });
  });

  it("borde exacto de prioritario = 7", () => {
    // 3 (300M–1.000M) + 1 (equipo 6–20) + 3 (ahora) = 7
    expect(calcularScore({ facturacion: F300, equipo: E6, compromiso: C_AHORA, objetivo: corto })).toEqual({
      score: 7,
      segmento: "prioritario",
    });
  });

  it("6 puntos → calificado", () => {
    // 2 + 1 + 3 = 6
    expect(calcularScore({ facturacion: F100, equipo: E20, compromiso: C_AHORA, objetivo: corto }).segmento).toBe(
      "calificado",
    );
  });

  it("borde exacto de calificado = 4", () => {
    // 3 (300M–1.000M) + 1 (próximos 3 meses) = 4
    expect(calcularScore({ facturacion: F300, equipo: E1, compromiso: C_3M, objetivo: corto })).toEqual({
      score: 4,
      segmento: "calificado",
    });
  });

  it("3 puntos → nutrir", () => {
    // 2 + 1 (3 meses) = 3
    expect(calcularScore({ facturacion: F100, equipo: E2, compromiso: C_3M, objetivo: corto })).toEqual({
      score: 3,
      segmento: "nutrir",
    });
  });

  it("objetivo de exactamente 120 caracteres suma 1; 119 no", () => {
    const base = { facturacion: F100, equipo: E2, compromiso: C_3M };
    expect(calcularScore({ ...base, objetivo: "y".repeat(OBJETIVO_DETALLADO_MIN) }).score).toBe(4);
    expect(calcularScore({ ...base, objetivo: "y".repeat(OBJETIVO_DETALLADO_MIN - 1) }).score).toBe(3);
  });

  it("objetivo con espacios de relleno no cuenta", () => {
    const r = calcularScore({ facturacion: F100, equipo: E2, compromiso: C_3M, objetivo: `  ${"z".repeat(118)}   ` });
    expect(r.score).toBe(3);
  });

  it("regla dura: facturación < 100M siempre nutrir aunque el resto sea máximo", () => {
    expect(calcularScore({ facturacion: F0, equipo: E20, compromiso: C_AHORA, objetivo: largo })).toEqual({
      score: 5,
      segmento: "nutrir",
    });
  });

  it("regla dura: 'Solo estoy explorando' siempre nutrir aunque facture > 1.000M", () => {
    expect(calcularScore({ facturacion: F1000, equipo: E20, compromiso: C_EXPL, objetivo: largo })).toEqual({
      score: 6,
      segmento: "nutrir",
    });
  });

  it("valores desconocidos no suman ni rompen", () => {
    expect(calcularScore({ facturacion: "???", equipo: "???", compromiso: "???", objetivo: "" })).toEqual({
      score: 0,
      segmento: "nutrir",
    });
  });
});
