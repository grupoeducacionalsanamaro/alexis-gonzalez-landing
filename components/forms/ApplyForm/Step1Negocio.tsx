"use client";

import { Controller } from "react-hook-form";
import { formOptions, site } from "@/content/site";
import { ChipGroup } from "@/components/ui/Chip";
import type { ApplyForm } from "./types";

export function Step1Negocio({ form, onEnter }: { form: ApplyForm; onEnter: () => void }) {
  const L = site.applyForm.labels;
  const { control } = form;
  return (
    <div className="grid gap-6">
      <Controller
        control={control}
        name="perfil"
        render={({ field, fieldState }) => (
          <ChipGroup multiple name="perfil" label={L.perfil} options={formOptions.perfil} value={field.value} onChange={field.onChange} error={fieldState.error?.message} onEnter={onEnter} />
        )}
      />
      <Controller
        control={control}
        name="sector"
        render={({ field, fieldState }) => (
          <ChipGroup multiple name="sector" label={L.sector} options={formOptions.sector} value={field.value} onChange={field.onChange} error={fieldState.error?.message} onEnter={onEnter} />
        )}
      />
      <Controller
        control={control}
        name="facturacion"
        render={({ field, fieldState }) => (
          <ChipGroup name="facturacion" label={L.facturacion} options={formOptions.facturacion} value={field.value} onChange={field.onChange} error={fieldState.error?.message} onEnter={onEnter} />
        )}
      />
    </div>
  );
}
