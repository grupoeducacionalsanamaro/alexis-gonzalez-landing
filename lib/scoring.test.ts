import { describe, expect, it } from "vitest";
import { formOptions } from "@/content/site";
import { calcularScore, RESULTADO_DETALLADO_MIN } from "./scoring";

const [F_NO, F0, F100, F300, F1000] = formOptions.facturacion;
const [P_DUENO, P_INDEP, , P_EMPLEADO] = formOptions.perfil;
const [I_SI, I_DEPENDE, I_NO] = formOptions.inversion;
const corto = "Ordenar mi clínica.";
const largo = "x".repeat(RESULTADO_DETALLADO_MIN);

describe("calcularScore", () => {
  it("máximo puntaje → prioritario (4+1+3+1 = 9)", () => {
    expect(calcularScore({ perfil: [P_DUENO], facturacion: F1000, inversion: I_SI, resultado: largo })).toEqual({
      score: 9,
      segmento: "prioritario",
    });
  });

  it("borde exacto de prioritario = 7", () => {
    // 3 ($300M–1.000M) + 1 (dueño) + 3 (sí invierte) = 7
    expect(calcularScore({ perfil: [P_DUENO], facturacion: F300, inversion: I_SI, resultado: corto })).toEqual({
      score: 7,
      segmento: "prioritario",
    });
  });

  it("6 puntos → calificado", () => {
    // 2 + 1 + 3 = 6
    expect(calcularScore({ perfil: [P_DUENO], facturacion: F100, inversion: I_SI, resultado: corto }).segmento).toBe("calificado");
  });

  it("borde exacto de calificado = 4", () => {
    // 2 ($100–300M) + 1 (depende) + 1 (resultado detallado) = 4, independiente sin punto de perfil
    expect(calcularScore({ perfil: [P_INDEP], facturacion: F100, inversion: I_DEPENDE, resultado: largo })).toEqual({
      score: 4,
      segmento: "calificado",
    });
  });

  it("3 puntos → nutrir", () => {
    expect(calcularScore({ perfil: [P_INDEP], facturacion: F100, inversion: I_DEPENDE, resultado: corto }).segmento).toBe("nutrir");
  });

  it("regla dura: menos de $100M o sin facturar → siempre nutrir", () => {
    expect(calcularScore({ perfil: [P_DUENO], facturacion: F0, inversion: I_SI, resultado: largo }).segmento).toBe("nutrir");
    expect(calcularScore({ perfil: [P_DUENO], facturacion: F_NO, inversion: I_SI, resultado: largo }).segmento).toBe("nutrir");
  });

  it("regla dura: sin presupuesto → siempre nutrir", () => {
    expect(calcularScore({ perfil: [P_DUENO], facturacion: F1000, inversion: I_NO, resultado: largo }).segmento).toBe("nutrir");
  });

  it("regla dura: solo empleado sin negocio propio → nutrir; combinado con dueño, no", () => {
    expect(calcularScore({ perfil: [P_EMPLEADO], facturacion: F1000, inversion: I_SI, resultado: largo }).segmento).toBe("nutrir");
    expect(calcularScore({ perfil: [P_EMPLEADO, P_DUENO], facturacion: F1000, inversion: I_SI, resultado: largo }).segmento).toBe(
      "prioritario",
    );
  });
});
