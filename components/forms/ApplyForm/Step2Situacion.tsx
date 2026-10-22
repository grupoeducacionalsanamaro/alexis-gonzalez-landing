"use client";

import { Controller } from "react-hook-form";
import { formOptions, site } from "@/content/site";
import { ChipGroup } from "@/components/ui/Chip";
import { TextArea } from "@/components/ui/Field";
import type { ApplyForm } from "./types";

export function Step2Situacion({ form, onEnter }: { form: ApplyForm; onEnter: () => void }) {
  const L = site.applyForm.labels;
  const { control, register, watch, formState } = form;
  const { errors, touchedFields: t } = formState;
  const contador = (n: number) => <span className="tabular-nums">{n}/400</span>;
  return (
    <div className="grid gap-6">
      <Controller
        control={control}
        name="etapa"
        render={({ field, fieldState }) => (
          <ChipGroup name="etapa" label={L.etapa} options={formOptions.etapa} value={field.value} onChange={field.onChange} error={fieldState.error?.message} onEnter={onEnter} />
        )}
      />
      <TextArea
        label={L.problema}
        maxLength={400}
        error={errors.problema?.message}
        valid={t.problema && !errors.problema}
        hint={contador((watch("problema") ?? "").length)}
        {...register("problema")}
      />
      <TextArea
        label={L.resultado}
        maxLength={400}
        error={errors.resultado?.message}
        valid={t.resultado && !errors.resultado}
        hint={contador((watch("resultado") ?? "").length)}
        {...register("resultado")}
      />
      <Controller
        control={control}
        name="inversion"
        render={({ field, fieldState }) => (
          <ChipGroup
            name="inversion"
            columns={1}
            label={L.inversion}
            options={formOptions.inversion}
            value={field.value}
            onChange={field.onChange}
            error={fieldState.error?.message}
            onEnter={onEnter}
          />
        )}
      />
    </div>
  );
}
