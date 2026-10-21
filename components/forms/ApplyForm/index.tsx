"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { site } from "@/content/site";
import { track, newEventId } from "@/lib/analytics";
import { readUtm } from "@/lib/utm";
import { ease, isReducedMotion } from "@/lib/animations";
import { markSubmitted } from "@/lib/formUtils";
import { Button } from "@/components/ui/Button";
import {
  clientApplySchema,
  STEP_FIELDS,
  type ApplyValues,
  type Resultado as R,
} from "./types";
import { Step1Negocio } from "./Step1Negocio";
import { Step2Situacion } from "./Step2Situacion";
import { Step3Datos } from "./Step3Datos";
import { Resultado } from "./Resultado";

const DRAFT_KEY = "ag_apply_draft";
type Draft = { values: Partial<ApplyValues>; step: number; ts: number };

function readDraft(): Draft | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const d = JSON.parse(raw) as Draft;
    if (Date.now() - d.ts > 1000 * 60 * 60 * 24 * 30) return null;
    const hasData = Object.values(d.values ?? {}).some((v) =>
      Array.isArray(v) ? v.length : v,
    );
    return hasData ? d : null;
  } catch {
    return null;
  }
}

export function ApplyForm({ location = "postulacion" }: { location?: string }) {
  const T = site.applyForm;
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [result, setResult] = useState<R | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [startedAt, setStartedAt] = useState(0);
  const started = useRef(false);
  const partialSent = useRef<string | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const userNavigated = useRef(false);
  const stepRef = useRef(step);
  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  const form = useForm<ApplyValues>({
    resolver: zodResolver(clientApplySchema),
    mode: "onBlur",
    reValidateMode: "onBlur",
    shouldUnregister: false,
    defaultValues: {
      dolores: [],
      objetivo: "",
      nombre: "",
      email: "",
      whatsapp: "",
      ciudad: "",
      webOInstagram: "",
      empresa_web: "",
    },
  });
  const { handleSubmit, trigger, subscribe, getValues, reset } = form;

  // Ofrecer retomar borrador
  useEffect(() => {
    const t = window.setTimeout(() => {
      setStartedAt(Date.now());
      setDraft(readDraft());
    }, 0);
    return () => window.clearTimeout(t);
  }, []);

  // Guardar borrador en cada cambio + form_start
  useEffect(() => {
    const unsubscribe = subscribe({
      formState: { values: true },
      callback: ({ values }) => {
        if (!started.current) {
          started.current = true;
          track("form_start", { location });
        }
        try {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { consentimiento, empresa_web, ...rest } =
            values as ApplyValues;
          localStorage.setItem(
            DRAFT_KEY,
            JSON.stringify({
              values: rest,
              step: stepRef.current,
              ts: Date.now(),
            }),
          );
        } catch {
          /* noop */
        }
      },
    });
    return () => unsubscribe();
  }, [subscribe, location]);

  // Transición entre pasos (sale a la izquierda, entra desde la derecha)
  const animate = useCallback(async (dir: 1 | -1, change: () => void) => {
    const el = panel.current;
    const reduced = isReducedMotion();
    if (el && el.animate) {
      const dur = reduced ? 150 : 300;
      const anim = el.animate(
        reduced
          ? [{ opacity: 1 }, { opacity: 0 }]
          : [
              { opacity: 1, transform: "translateX(0)" },
              { opacity: 0, transform: `translateX(${-24 * dir}px)` },
            ],
        { duration: dur, easing: ease.inOut, fill: "forwards" },
      );
      // No depender solo de `finished` (puede demorarse en pestañas en segundo plano)
      await Promise.race([
        anim.finished.catch(() => {}),
        new Promise((r) => setTimeout(r, dur + 80)),
      ]);
    }
    change();
    userNavigated.current = true;
    requestAnimationFrame(() => {
      const el2 = panel.current;
      el2?.animate(
        reduced
          ? [{ opacity: 0 }, { opacity: 1 }]
          : [
              { opacity: 0, transform: `translateX(${24 * dir}px)` },
              { opacity: 1, transform: "translateX(0)" },
            ],
        {
          duration: reduced ? 200 : 450,
          easing: ease.outQuart,
          fill: "forwards",
        },
      );
    });
  }, []);

  // Foco en el primer control al cambiar de paso (no en la carga inicial)
  useEffect(() => {
    if (!userNavigated.current) return;
    const el = panel.current;
    const first = el?.querySelector<HTMLElement>(
      '[role="radio"][tabindex="0"], [role="checkbox"], input:not([tabindex="-1"]), textarea, [data-result-heading]',
    );
    first?.focus({ preventScroll: true });
    root.current?.scrollIntoView({
      block: "start",
      behavior: isReducedMotion() ? "auto" : "smooth",
    });
  }, [step, result]);

  const next = useCallback(async () => {
    const ok = await trigger(STEP_FIELDS[step], { shouldFocus: true });
    if (!ok) return;
    track("form_step", { step: step + 1 });
    if (step < 2) animate(1, () => setStep((s) => s + 1));
  }, [step, trigger, animate]);

  const back = () => animate(-1, () => setStep((s) => Math.max(0, s - 1)));

  const sendPartial = (email: string) => {
    if (partialSent.current === email) return;
    partialSent.current = email;
    const v = getValues();
    fetch("/api/apply?partial=1", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        nombre: v.nombre,
        whatsapp: v.whatsapp,
        especialidad: v.especialidad,
        facturacion: v.facturacion,
        equipo: v.equipo,
        compromiso: v.compromiso,
        startedAt,
        utm: readUtm(),
        landing: window.location.pathname,
      }),
      keepalive: true,
    }).catch(() => {});
  };

  const submit = async (v: ApplyValues) => {
    setSubmitting(true);
    setServerError(null);
    const eventId = newEventId("apply");
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...v,
          startedAt,
          eventId,
          utm: readUtm(),
          landing: window.location.pathname,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        segmento?: R["segmento"];
        ebookUrl?: string | null;
        error?: string;
      };
      if (!res.ok || !data.ok || !data.segmento)
        throw new Error(data.error || T.errorEnvio);
      track("form_submit", { eventId });
      if (data.segmento !== "nutrir")
        track("form_qualified", { segmento: data.segmento, eventId });
      markSubmitted();
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch {
        /* noop */
      }
      const r = { segmento: data.segmento, ebookUrl: data.ebookUrl ?? null };
      animate(1, () => setResult(r));
    } catch (e) {
      setServerError(e instanceof Error ? e.message : T.errorEnvio);
    } finally {
      setSubmitting(false);
    }
  };

  const onFormSubmit = (e: FormEvent) => {
    if (step < 2) {
      e.preventDefault();
      next();
      return;
    }
    track("form_step", { step: 3 });
    handleSubmit(submit)(e);
  };

  const resume = () => {
    if (!draft) return;
    reset({ ...form.getValues(), ...draft.values } as ApplyValues);
    started.current = true;
    animate(1, () => setStep(Math.min(2, Math.max(0, draft.step))));
    setDraft(null);
  };
  const discard = () => {
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      /* noop */
    }
    setDraft(null);
  };

  if (result) {
    return (
      <div ref={root} className="scroll-mt-28">
        <div ref={panel}>
          <Resultado
            result={result}
            nombre={getValues("nombre")}
            email={getValues("email")}
          />
        </div>
      </div>
    );
  }

  const pct = ((step + 1) / 3) * 100;
  return (
    <div ref={root} className="scroll-mt-28 text-ink-950">
      {/* Progreso */}
      <div className="mb-8">
        <div className="flex items-baseline justify-between gap-4">
          <p className="t-eyebrow text-ink-950/70" aria-live="polite">
            Paso {step + 1} de 3 ·{" "}
            <span className="text-ink-950">{T.pasos[step]}</span>
          </p>
        </div>
        <div
          className="mt-3 h-[2px] w-full bg-ink-950/10"
          role="progressbar"
          aria-label="Progreso de la postulación"
          aria-valuemin={1}
          aria-valuemax={3}
          aria-valuenow={step + 1}
        >
          <div
            className="h-full origin-left transition-transform duration-500 ease-in-out"
            style={{
              background: "var(--accent-gradient)",
              transform: `scaleX(${pct / 100})`,
            }}
          />
        </div>
      </div>

      {draft && step === 0 && (
        <div className="mb-8 flex flex-col gap-4 rounded-[4px] border border-ink-950/15 p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[15px] font-medium">{T.retomarTitulo}</p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={resume}
              className="btn btn-primary t-btn h-11! min-h-11! px-5!"
            >
              <span className="btn-label">{T.retomar}</span>
            </button>
            <button
              type="button"
              onClick={discard}
              className="t-btn px-3 text-ink-950/60 underline-offset-4 hover:underline"
            >
              {T.empezar}
            </button>
          </div>
        </div>
      )}

      <form
        onSubmit={onFormSubmit}
        noValidate
        aria-label="Formulario de postulación"
      >
        <div ref={panel}>
          {step === 0 && <Step1Negocio form={form} onEnter={next} />}
          {step === 1 && <Step2Situacion form={form} onEnter={next} />}
          {step === 2 && <Step3Datos form={form} onEmailValid={sendPartial} />}
        </div>

        <p
          aria-live="assertive"
          className="min-h-[20px] pt-2 text-[14px] text-no"
        >
          {serverError ?? ""}
        </p>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          {step > 0 ? (
            <button
              type="button"
              onClick={back}
              className="btn btn-ghost t-btn border-ink-950/20! text-ink-950! hover:border-ink-950! hover:bg-ink-950/5!"
            >
              <span className="btn-label">{T.atras}</span>
            </button>
          ) : (
            <span />
          )}
          <Button
            type="submit"
            variant="primary"
            loading={submitting}
            location={step < 2 ? `form_step_${step + 1}` : "form_submit"}
            className="w-full sm:w-auto"
          >
            {step < 2 ? T.continuar : T.enviar}
          </Button>
        </div>
      </form>
    </div>
  );
}
