"use client";

import { useId, useState } from "react";
import { track } from "@/lib/analytics";

type Item = { pregunta: string; respuesta: string };

export function Accordion({ items }: { items: Item[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const base = useId();
  return (
    <div className="border-t border-ink-700">
      {items.map((it, i) => {
        const isOpen = open === i;
        const btnId = `${base}-b${i}`;
        const panelId = `${base}-p${i}`;
        return (
          <div key={it.pregunta} className="border-b border-ink-700">
            <h3>
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => {
                  setOpen(isOpen ? null : i);
                  if (!isOpen) track("faq_open", { pregunta: it.pregunta });
                }}
                className="group flex w-full items-center justify-between gap-6 py-7 text-left font-display text-[19px] font-bold tracking-[-0.01em] text-paper transition-colors duration-200 hover:text-accent-300 md:text-[22px]"
              >
                <span>{it.pregunta}</span>
                <span
                  aria-hidden="true"
                  className="acc-icon grid size-9 shrink-0 place-items-center rounded-full border border-ink-700 text-[20px] font-light leading-none text-paper/80 transition-colors group-hover:border-accent-500"
                >
                  +
                </span>
              </button>
            </h3>
            <div id={panelId} role="region" aria-labelledby={btnId} className="acc-panel" data-open={isOpen}>
              <div>
                <p className="t-body max-w-[640px] pb-8">{it.respuesta}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
