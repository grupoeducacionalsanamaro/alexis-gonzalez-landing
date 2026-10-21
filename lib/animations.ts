/**
 * Helpers de motion reutilizables (GSAP + ScrollTrigger).
 * GSAP se carga con import dinámico, solo en cliente.
 */
import type { gsap as GSAPType } from "gsap";
import type { ScrollTrigger as STType } from "gsap/ScrollTrigger";

export const ease = {
  outExpo: "cubic-bezier(0.16, 1, 0.3, 1)",
  outQuart: "cubic-bezier(0.25, 1, 0.5, 1)",
  inOut: "cubic-bezier(0.65, 0, 0.35, 1)",
  micro: "cubic-bezier(0.2, 0, 0, 1)",
};
export const gEase = { outExpo: "expo.out", outQuart: "quart.out", inOut: "power3.inOut" };
export const stagger = { lines: 0.09, items: 0.06 };

export type Gsap = typeof GSAPType;
export type ST = typeof STType;
export type Motion = { gsap: Gsap; ScrollTrigger: ST };

let motionPromise: Promise<Motion> | null = null;

export function loadMotion(): Promise<Motion> {
  if (!motionPromise) {
    motionPromise = Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([g, st]) => {
      const gsap = g.gsap;
      const ScrollTrigger = st.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);
      (window as Window & { __agMotion?: boolean }).__agMotion = true;
      return { gsap, ScrollTrigger };
    });
  }
  return motionPromise;
}

/**
 * Cola de trabajo de motion: cada job corre en su propia tarea y se cede el hilo entre
 * uno y otro. Sin esto, al llegar GSAP todos los setups (split de líneas, ScrollTriggers,
 * lecturas de layout) se ejecutaban en una sola tarea larga que bloqueaba el hilo (TBT).
 */
const motionQueue: (() => void)[] = [];
let pumping = false;

function pumpMotionQueue() {
  const job = motionQueue.shift();
  if (!job) {
    pumping = false;
    return;
  }
  try {
    job();
  } finally {
    setTimeout(pumpMotionQueue, 0);
  }
}

export function queueMotion(job: () => void) {
  motionQueue.push(job);
  if (!pumping) {
    pumping = true;
    setTimeout(pumpMotionQueue, 0);
  }
}

/** true si el usuario pidió menos movimiento (respeta override ?motion=full). */
export function isReducedMotion(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.classList.contains("rm");
}

export function isDesktopPointer(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

/** Entrada firma "desde la oscuridad". */
export function revealUp(gsap: Gsap, el: gsap.TweenTarget, opts: gsap.TweenVars = {}) {
  if (isReducedMotion()) {
    return gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.2, ...pick(opts, ["delay", "stagger", "scrollTrigger"]) });
  }
  return gsap.fromTo(
    el,
    { y: 32, opacity: 0, filter: "blur(8px)" },
    { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.9, ease: gEase.outExpo, clearProps: "filter", ...opts },
  );
}

/** Divide un titular en líneas visuales y las sube desde una máscara. */
export function maskLines(gsap: Gsap, el: HTMLElement, opts: gsap.TweenVars = {}) {
  const inners = splitLines(el);
  if (isReducedMotion()) {
    return gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.2, ...pick(opts, ["delay", "scrollTrigger"]) });
  }
  gsap.set(el, { opacity: 1 });
  return gsap.fromTo(
    inners,
    { yPercent: 105 },
    { yPercent: 0, duration: 1.1, ease: gEase.outExpo, stagger: stagger.lines, ...opts },
  );
}

/**
 * Split propio por líneas: envuelve palabras, mide offsetTop y agrupa.
 * Conserva el texto accesible con un span .sr-only (las líneas van aria-hidden).
 * Respeta nodos hijos (p. ej. <span class="accent-text">) clonándolos por palabra.
 */
export function splitLines(el: HTMLElement): HTMLElement[] {
  if (el.dataset.split === "done") return Array.from(el.querySelectorAll<HTMLElement>(".line-mask > span"));
  const label = el.textContent?.replace(/\s+/g, " ").trim() ?? "";
  const words: HTMLElement[] = [];

  const wrapNode = (node: Node, parentClone: (w: HTMLElement) => HTMLElement) => {
    node.childNodes.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        (child.textContent ?? "").split(/([ \t\n\r]+)/).forEach((part) => {
          if (!part.replace(/[ \t\n\r]/g, "")) return;
          const w = document.createElement("span");
          w.style.display = "inline-block";
          w.textContent = part;
          words.push(parentClone(w));
        });
      } else if (child instanceof HTMLElement) {
        if (child.tagName === "BR") {
          const br = document.createElement("span");
          br.dataset.br = "1";
          words.push(br);
          return;
        }
        wrapNode(child, (w) => {
          const c = child.cloneNode(false) as HTMLElement;
          c.style.display = "inline-block";
          c.appendChild(w);
          return parentClone(c);
        });
      }
    });
  };
  wrapNode(el, (w) => w);

  el.textContent = "";
  words.forEach((w, i) => {
    el.appendChild(w);
    if (i < words.length - 1 && !w.dataset.br) el.appendChild(document.createTextNode(" "));
  });

  const lines: HTMLElement[][] = [];
  let lastTop: number | null = null;
  let forceBreak = false;
  words.forEach((w) => {
    if (w.dataset.br) {
      forceBreak = true;
      return;
    }
    const top = w.offsetTop;
    if (lastTop === null || forceBreak || Math.abs(top - lastTop) > 4) {
      lines.push([w]);
      lastTop = top;
      forceBreak = false;
    } else lines[lines.length - 1].push(w);
  });

  el.textContent = "";
  const sr = document.createElement("span");
  sr.className = "sr-only";
  sr.textContent = label;
  el.appendChild(sr);
  const inners: HTMLElement[] = [];
  lines.forEach((line) => {
    const mask = document.createElement("span");
    mask.className = "line-mask";
    mask.setAttribute("aria-hidden", "true");
    const inner = document.createElement("span");
    line.forEach((w, i) => {
      inner.appendChild(w);
      if (i < line.length - 1) inner.appendChild(document.createTextNode(" "));
    });
    mask.appendChild(inner);
    el.appendChild(mask);
    inners.push(inner);
  });
  el.dataset.split = "done";
  return inners;
}

/** Dibuja trazos SVG (stroke-dashoffset de longitud total a 0). */
export function drawStroke(gsap: Gsap, svg: Element, opts: gsap.TweenVars = {}) {
  const paths = Array.from(svg.querySelectorAll<SVGGeometryElement>("path, line, polyline, polygon, circle, rect"));
  paths.forEach((p) => {
    const len = typeof p.getTotalLength === "function" ? p.getTotalLength() : 400;
    p.style.strokeDasharray = `${len}`;
    p.style.strokeDashoffset = `${len}`;
  });
  if (isReducedMotion()) {
    gsap.set(paths, { strokeDashoffset: 0 });
    return gsap.fromTo(svg, { opacity: 0 }, { opacity: 1, duration: 0.2, ...pick(opts, ["delay", "scrollTrigger"]) });
  }
  gsap.set(svg, { opacity: 1 });
  return gsap.to(paths, { strokeDashoffset: 0, duration: 1.4, ease: gEase.inOut, stagger: 0.04, ...opts });
}

/** Barrido de brillo de acento, una sola vez. */
export function accentSweep(gsap: Gsap, el: gsap.TweenTarget, opts: gsap.TweenVars = {}) {
  if (isReducedMotion()) return gsap.set(el, { backgroundPosition: "0% 0" });
  return gsap.fromTo(
    el,
    { backgroundPosition: "100% 0" },
    { backgroundPosition: "0% 0", duration: 1.2, ease: gEase.inOut, ...opts },
  );
}

const nf = new Intl.NumberFormat("es-CL");

/** Contador con expo.out y formato es-CL. */
export function countUp(gsap: Gsap, el: HTMLElement, to: number, duration = 1.2, opts: gsap.TweenVars = {}) {
  const obj = { v: 0 };
  if (isReducedMotion()) {
    el.textContent = nf.format(to);
    return gsap.set(obj, { v: to });
  }
  el.textContent = "0";
  return gsap.to(obj, {
    v: to,
    duration,
    ease: gEase.outExpo,
    onUpdate: () => {
      el.textContent = nf.format(Math.round(obj.v));
    },
    ...opts,
  });
}

/** Divide en palabras y liga su opacidad (0.15 → 1) al progreso del scroll. */
export function scrubOpacityWords(gsap: Gsap, el: HTMLElement, trigger: Element, opts: ScrollTrigger.Vars = {}) {
  const words = splitWords(el);
  if (isReducedMotion()) return null;
  return gsap.fromTo(
    words,
    { opacity: 0.15 },
    {
      opacity: 1,
      ease: "none",
      stagger: 0.1,
      scrollTrigger: { trigger, start: "top 75%", end: "bottom 60%", scrub: 0.6, ...opts },
    },
  );
}

export function splitWords(el: HTMLElement): HTMLElement[] {
  if (el.dataset.words === "done") return Array.from(el.querySelectorAll<HTMLElement>("[data-w]"));
  const out: HTMLElement[] = [];
  const walk = (node: Node) => {
    Array.from(node.childNodes).forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        (child.textContent ?? "").split(/([ \t\n\r]+)/).forEach((part) => {
          if (!part) return;
          if (!part.replace(/[ \t\n\r]/g, "")) {
            frag.appendChild(document.createTextNode(part));
            return;
          }
          const s = document.createElement("span");
          s.dataset.w = "1";
          s.textContent = part;
          out.push(s);
          frag.appendChild(s);
        });
        child.replaceWith(frag);
      } else if (child instanceof HTMLElement) {
        if (child.classList.contains("accent-text")) {
          child.dataset.w = "1";
          out.push(child);
        } else walk(child);
      }
    });
  };
  walk(el);
  el.dataset.words = "done";
  return out;
}

function pick<T extends object>(o: T, keys: string[]): Partial<T> {
  const r: Record<string, unknown> = {};
  keys.forEach((k) => {
    if (k in o) r[k] = (o as Record<string, unknown>)[k];
  });
  return r as Partial<T>;
}
