"use client";

import { useRef, type KeyboardEvent } from "react";

const CheckIcon = () => (
  <svg viewBox="0 0 16 16" width="12" height="12" fill="none" aria-hidden="true">
    <path d="M3 8.5l3.2 3L13 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

type GroupProps = {
  label: string;
  options: readonly string[];
  multiple?: boolean;
  value: string | string[] | undefined;
  onChange: (v: string | string[]) => void;
  error?: string;
  columns?: 1 | 2;
  autoFocus?: boolean;
  name: string;
  /** Enter sobre una opción ya elegida (p. ej. avanzar de paso). */
  onEnter?: () => void;
};

/**
 * Grupo de chips accesible: role=radiogroup (o group + checkbox).
 * Flechas mueven el foco (roving tabindex), Espacio/Enter selecciona.
 */
export function ChipGroup({ label, options, multiple, value, onChange, error, columns = 2, autoFocus, name, onEnter }: GroupProps) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const selected = (o: string) => (multiple ? Array.isArray(value) && value.includes(o) : value === o);
  const focusIndex = Math.max(
    0,
    options.findIndex((o) => selected(o)),
  );

  const toggle = (o: string) => {
    if (multiple) {
      const arr = Array.isArray(value) ? value : [];
      onChange(arr.includes(o) ? arr.filter((x) => x !== o) : [...arr, o]);
    } else onChange(o);
  };

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const n = options.length;
    let next = -1;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = (i + 1) % n;
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = (i - 1 + n) % n;
    if (next >= 0) {
      e.preventDefault();
      refs.current[next]?.focus();
      if (!multiple) onChange(options[next]);
    }
    if (e.key === "Enter") {
      // Enter selecciona; si ya estaba elegida, avanza
      e.preventDefault();
      if (!selected(options[i])) toggle(options[i]);
      else onEnter?.();
    }
  };

  const labelId = `${name}-label`;
  return (
    <fieldset className="min-w-0">
      <legend id={labelId} className="mb-4 font-display text-[15px] font-medium text-ink-950 md:text-[16px]">
        {label}
        {multiple && <span className="ml-2 text-[13px] font-normal opacity-60">(puedes elegir varias)</span>}
      </legend>
      <div
        role={multiple ? "group" : "radiogroup"}
        aria-labelledby={labelId}
        aria-invalid={!!error || undefined}
        aria-describedby={error ? `${name}-err` : undefined}
        className={`grid gap-2.5 ${columns === 2 ? "sm:grid-cols-2" : ""}`}
      >
        {options.map((o, i) => {
          const on = selected(o);
          return (
            <button
              key={o}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role={multiple ? "checkbox" : "radio"}
              aria-checked={on}
              tabIndex={multiple ? 0 : i === focusIndex ? 0 : -1}
              autoFocus={autoFocus && i === 0}
              onClick={() => toggle(o)}
              onKeyDown={(e) => onKey(e, i)}
              className="chip"
              data-chip={name}
            >
              <span className="chip-check">
                <CheckIcon />
              </span>
              <span>{o}</span>
            </button>
          );
        })}
      </div>
      <p id={`${name}-err`} aria-live="polite" className="min-h-[20px] pt-2 text-[13px] text-no">
        {error ?? ""}
      </p>
    </fieldset>
  );
}
