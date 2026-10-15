"use client";

import { Controller } from "react-hook-form";
import { formOptions, site } from "@/content/site";
import { ChipGroup } from "@/components/ui/Chip";
import { TextArea } from "@/components/ui/Field";
import type { ApplyForm } from "./types";

export function Step2Situacion({ form, onEnter }: { form: ApplyForm; onEnter: () => void }) {
  const L = site.applyForm.labels;
  const { control, register, watch, formState } = form;
  const len = (watch("objetivo") ?? "").length;
  return (
    <div className="grid gap-6">
      <Controller
        control={control}
        name="dolores"
        render={({ field, fieldState }) => (
          <ChipGroup
            multiple
            name="dolores"
            label={L.dolores}
            options={formOptions.dolores}
            value={field.value}
            onChange={field.onChange}
            error={fieldState.error?.message}
            onEnter={onEnter}
          />
        )}
      />
      <TextArea
        label={L.objetivo}
        maxLength={400}
        error={formState.errors.objetivo?.message}
        valid={formState.touchedFields.objetivo && !formState.errors.objetivo}
        hint={<span className="tabular-nums">{len}/400</span>}
        {...register("objetivo")}
      />
      <Controller
        control={control}
        name="compromiso"
        render={({ field, fieldState }) => (
          <ChipGroup
            name="compromiso"
            columns={1}
            label={L.compromiso}
            options={formOptions.compromiso}
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
