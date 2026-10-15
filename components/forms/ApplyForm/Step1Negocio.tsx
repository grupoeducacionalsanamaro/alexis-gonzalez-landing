"use client";

import { Controller } from "react-hook-form";
import { formOptions, site } from "@/content/site";
import { ChipGroup } from "@/components/ui/Chip";
import { Field } from "@/components/ui/Field";
import type { ApplyForm } from "./types";

export function Step1Negocio({ form, onEnter }: { form: ApplyForm; onEnter: () => void }) {
  const L = site.applyForm.labels;
  const { control, register, watch, formState } = form;
  const esp = watch("especialidad");
  return (
    <div className="grid gap-6">
      <Controller
        control={control}
        name="especialidad"
        render={({ field, fieldState }) => (
          <ChipGroup name="especialidad" label={L.especialidad} options={formOptions.especialidad} value={field.value} onChange={field.onChange} error={fieldState.error?.message} onEnter={onEnter} />
        )}
      />
      {esp === "Otro" && (
        <Field label={L.especialidadOtro} error={formState.errors.especialidadOtro?.message} {...register("especialidadOtro")} className="-mt-4" />
      )}
      <Controller
        control={control}
        name="facturacion"
        render={({ field, fieldState }) => (
          <ChipGroup name="facturacion" label={L.facturacion} options={formOptions.facturacion} value={field.value} onChange={field.onChange} error={fieldState.error?.message} onEnter={onEnter} />
        )}
      />
      <Controller
        control={control}
        name="equipo"
        render={({ field, fieldState }) => (
          <ChipGroup name="equipo" label={L.equipo} options={formOptions.equipo} value={field.value} onChange={field.onChange} error={fieldState.error?.message} onEnter={onEnter} />
        )}
      />
    </div>
  );
}
