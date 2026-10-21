"use client";

import { forwardRef, useEffect, useId, useState, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from "react";
import { Check } from "lucide-react";

type Common = {
  label: string;
  error?: string;
  valid?: boolean;
  dark?: boolean;
  prefix?: ReactNode;
  hint?: ReactNode;
};

/** Campo editorial: línea inferior, label flotante, línea de acento al foco, error con shake. */
export const Field = forwardRef<HTMLInputElement, Common & InputHTMLAttributes<HTMLInputElement>>(function Field(
  { label, error, valid, dark, prefix, hint, id, className = "", ...rest },
  ref,
) {
  const auto = useId();
  const fid = id ?? auto;
  const shake = useShake(error);
  return (
    <div className={`${className}`}>
      <div
        className={`field ${dark ? "field-dark" : ""} ${shake ? "shake" : ""}`}
        data-invalid={!!error}
        data-static-label={prefix ? "" : undefined}
      >
        <div className="flex items-end">
          {prefix && <span className="mr-2 pb-[11px] text-[17px] opacity-60">{prefix}</span>}
          <input
            ref={ref}
            id={fid}
            placeholder=" "
            aria-invalid={!!error}
            aria-describedby={error ? `${fid}-err` : hint ? `${fid}-hint` : undefined}
            className="field-input peer"
            {...rest}
          />
          <label htmlFor={fid} className="field-label">
            {label}
          </label>
          <span className="field-line" style={{ bottom: 0 }} aria-hidden="true" />
        </div>
        {valid && !error && (
          <Check aria-hidden="true" strokeWidth={1.5} className="absolute right-0 bottom-3 size-4 text-accent-500" />
        )}
      </div>
      <FieldMessage id={`${fid}-err`} error={error} />
      {hint && !error && (
        <p id={`${fid}-hint`} className="mt-2 text-[13px] opacity-60">
          {hint}
        </p>
      )}
    </div>
  );
});

export const TextArea = forwardRef<HTMLTextAreaElement, Common & TextareaHTMLAttributes<HTMLTextAreaElement>>(function TextArea(
  { label, error, valid, dark, hint, id, className = "", ...rest },
  ref,
) {
  const auto = useId();
  const fid = id ?? auto;
  const shake = useShake(error);
  return (
    <div className={className}>
      <div className={`field ${dark ? "field-dark" : ""} ${shake ? "shake" : ""}`} data-invalid={!!error}>
        <div className="relative">
          <textarea
            ref={ref}
            id={fid}
            placeholder=" "
            rows={3}
            aria-invalid={!!error}
            aria-describedby={error ? `${fid}-err` : hint ? `${fid}-hint` : undefined}
            className="field-input block resize-none"
            {...rest}
          />
          <label htmlFor={fid} className="field-label">
            {label}
          </label>
          <span className="field-line" aria-hidden="true" />
        </div>
        {valid && !error && (
          <Check aria-hidden="true" strokeWidth={1.5} className="absolute right-0 bottom-3 size-4 text-accent-500" />
        )}
      </div>
      <FieldMessage id={`${fid}-err`} error={error} />
      {hint && !error && (
        <p id={`${fid}-hint`} className="mt-2 text-[13px] opacity-60">
          {hint}
        </p>
      )}
    </div>
  );
});

export function FieldMessage({ id, error }: { id: string; error?: string }) {
  return (
    <p id={id} aria-live="polite" className="min-h-[20px] pt-2 text-[13px] text-no">
      {error ?? ""}
    </p>
  );
}

function useShake(error?: string) {
  const [shake, setShake] = useState(false);
  useEffect(() => {
    if (!error) return;
    const start = setTimeout(() => setShake(true), 0);
    const end = setTimeout(() => setShake(false), 320);
    return () => {
      clearTimeout(start);
      clearTimeout(end);
    };
  }, [error]);
  return shake;
}
