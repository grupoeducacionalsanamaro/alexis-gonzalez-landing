"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { site } from "@/content/site";
import { phoneCL } from "@/lib/schemas";
import { track, newEventId } from "@/lib/analytics";
import { readUtm } from "@/lib/utm";
import { formatPhoneCL, markSubmitted } from "@/lib/formUtils";
import { Field } from "@/components/ui/Field";
import { Checkbox } from "@/components/ui/Checkbox";
import { Button } from "@/components/ui/Button";

const clientSchema = z.object({
  nombre: z.string().trim().min(2, "Ingresa tu nombre").max(80),
  email: z.string().trim().email("Ingresa un email válido"),
  whatsapp: phoneCL,
  consentimiento: z.literal(true, { error: () => "Debes aceptar la política de privacidad" }),
  empresa_web: z.string().optional(),
});
type Values = z.input<typeof clientSchema>;

type Props = { onSuccess: (url: string | null) => void; location: string; autoFocus?: boolean };

export function EbookForm({ onSuccess, location, autoFocus }: Props) {
  const [startedAt, setStartedAt] = useState(0);
  useEffect(() => {
    const t = window.setTimeout(() => setStartedAt(Date.now()), 0);
    return () => window.clearTimeout(t);
  }, []);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, touchedFields },
  } = useForm<Values>({
    resolver: zodResolver(clientSchema),
    mode: "onBlur",
    reValidateMode: "onBlur",
    defaultValues: { nombre: "", email: "", whatsapp: "", empresa_web: "" },
  });

  const submit = async (v: Values) => {
    setSubmitting(true);
    setServerError(null);
    const eventId = newEventId("ebook");
    try {
      const res = await fetch("/api/ebook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...v, startedAt, eventId, utm: readUtm(), landing: location }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; url?: string | null; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error || "No pudimos enviar tus datos.");
      track("ebook_submit", { location, eventId });
      markSubmitted();
      onSuccess(data.url ?? null);
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "No pudimos enviar tus datos. Intenta nuevamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const onInvalid = (errs: FieldErrors<Values>) => {
    const first = Object.keys(errs)[0];
    if (first) document.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  };

  const wa = register("whatsapp");
  return (
    <form onSubmit={handleSubmit(submit, onInvalid)} noValidate className="text-paper">
      <div className="grid gap-x-8 gap-y-1 sm:grid-cols-2">
        <Field dark label="Nombre" autoComplete="given-name" autoFocus={autoFocus} data-autofocus={autoFocus ? "" : undefined} error={errors.nombre?.message} valid={touchedFields.nombre} {...register("nombre")} />
        <Field dark label="Email" type="email" autoComplete="email" inputMode="email" error={errors.email?.message} valid={touchedFields.email} {...register("email")} />
        <Field
          dark
          label="WhatsApp"
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          prefix="+56"
          error={errors.whatsapp?.message}
          valid={touchedFields.whatsapp}
          className="sm:col-span-2"
          {...wa}
          onChange={(e) => {
            const f = formatPhoneCL(e.target.value);
            e.target.value = f;
            setValue("whatsapp", f);
          }}
        />
      </div>
      {/* Honeypot */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Empresa web
          <input tabIndex={-1} autoComplete="off" {...register("empresa_web")} />
        </label>
      </div>
      <div className="mt-4">
        <Checkbox
          dark
          error={errors.consentimiento?.message}
          label={
            <>
              Acepto el tratamiento de mis datos según la{" "}
              <Link href="/privacidad" className="underline underline-offset-4" target="_blank">
                Política de privacidad
              </Link>
              .
            </>
          }
          {...register("consentimiento")}
        />
      </div>
      <p aria-live="assertive" className="min-h-[20px] text-[14px] text-no">
        {serverError ?? ""}
      </p>
      <Button type="submit" variant="accent" loading={submitting} location={`${location}_submit`} className="mt-2 w-full sm:w-auto">
        {site.ebook.formCta}
      </Button>
    </form>
  );
}
