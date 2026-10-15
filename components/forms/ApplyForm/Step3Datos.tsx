"use client";

import Link from "next/link";
import { site } from "@/content/site";
import { Field } from "@/components/ui/Field";
import { Checkbox } from "@/components/ui/Checkbox";
import { formatPhoneCL } from "@/lib/formUtils";
import type { ApplyForm } from "./types";

export function Step3Datos({ form, onEmailValid }: { form: ApplyForm; onEmailValid: (email: string) => void }) {
  const L = site.applyForm.labels;
  const { register, setValue, trigger, getValues, formState } = form;
  const { errors, touchedFields: t } = formState;
  const email = register("email");
  const wa = register("whatsapp");
  return (
    <div className="grid gap-x-8 gap-y-1 sm:grid-cols-2">
      <Field label={L.nombre} autoComplete="name" error={errors.nombre?.message} valid={t.nombre} {...register("nombre")} />
      <Field
        label={L.email}
        type="email"
        inputMode="email"
        autoComplete="email"
        error={errors.email?.message}
        valid={t.email}
        {...email}
        onBlur={async (e) => {
          await email.onBlur(e);
          if (await trigger("email")) onEmailValid(getValues("email"));
        }}
      />
      <Field
        label={L.whatsapp}
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        prefix="+56"
        error={errors.whatsapp?.message}
        valid={t.whatsapp}
        {...wa}
        onChange={(e) => {
          const f = formatPhoneCL(e.target.value);
          e.target.value = f;
          setValue("whatsapp", f);
        }}
      />
      <Field label={L.ciudad} autoComplete="address-level2" error={errors.ciudad?.message} valid={t.ciudad} {...register("ciudad")} />
      <Field label={L.webOInstagram} className="sm:col-span-2" autoComplete="url" error={errors.webOInstagram?.message} {...register("webOInstagram")} />
      {/* Honeypot */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Empresa web
          <input tabIndex={-1} autoComplete="off" {...register("empresa_web")} />
        </label>
      </div>
      <div className="mt-4 sm:col-span-2">
        <Checkbox
          error={errors.consentimiento?.message}
          label={
            <>
              {L.consentimientoPre}{" "}
              <Link href="/privacidad" target="_blank" className="underline underline-offset-4">
                {L.consentimientoLink}
              </Link>
              .
            </>
          }
          {...register("consentimiento")}
        />
      </div>
    </div>
  );
}
