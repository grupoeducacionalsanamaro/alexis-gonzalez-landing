"use client";

import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";

type Props = { label: ReactNode; error?: string; dark?: boolean } & Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export const Checkbox = forwardRef<HTMLInputElement, Props>(function Checkbox({ label, error, dark, id, ...rest }, ref) {
  const auto = useId();
  const fid = id ?? auto;
  return (
    <div>
      <div className="flex items-start gap-3">
        <input
          ref={ref}
          id={fid}
          type="checkbox"
          className={`checkbox ${dark ? "checkbox-dark" : ""}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${fid}-err` : undefined}
          {...rest}
        />
        <label htmlFor={fid} className="cursor-pointer text-[14px] leading-relaxed opacity-80">
          {label}
        </label>
      </div>
      <p id={`${fid}-err`} aria-live="polite" className="min-h-[20px] pt-1 text-[13px] text-no">
        {error ?? ""}
      </p>
    </div>
  );
});
