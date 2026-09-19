"use client";

import { useEffect, useId, useRef, useState } from "react";

interface MermaidApi {
  initialize(cfg: Record<string, unknown>): void;
  render(id: string, text: string): Promise<{ svg: string }>;
}

let loadPromise: Promise<MermaidApi> | null = null;

function loadMermaid(): Promise<MermaidApi> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("mermaid solo se carga en el cliente"));
  }
  loadPromise ??= new Promise((resolve, reject) => {
    const w = window as unknown as { mermaid?: MermaidApi };
    if (w.mermaid) {
      resolve(w.mermaid);
      return;
    }
    const script = document.createElement("script");
    script.src = "/vendor/mermaid.min.js";
    script.onload = () =>
      w.mermaid ? resolve(w.mermaid) : reject(new Error("mermaid.min.js cargado sin API"));
    script.onerror = () =>
      reject(new Error("No se pudo cargar el motor de diagramas (mermaid.min.js)."));
    document.head.appendChild(script);
  });
  return loadPromise;
}

const THEME_CONFIG = {
  startOnLoad: false,
  theme: "dark",
  securityLevel: "loose",
  themeVariables: {
    background: "transparent",
    fontFamily: "var(--font-sans), system-ui, sans-serif",
    primaryColor: "#0e1626",
    primaryBorderColor: "#2a3c60",
    primaryTextColor: "#e8edf7",
    lineColor: "#38bdf8",
    secondaryColor: "#0b1120",
    tertiaryColor: "#131d33",
  },
};

let renderCounter = 0;

export function Mermaid({ code, caption }: { code: string; caption?: string }) {
  const base = useId().replace(/:/g, "");
  const [svg, setSvg] = useState("");
  const [error, setError] = useState<string | null>(null);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    const id = `mmd-${base}-${++renderCounter}`;
    let cancelled = false;

    loadMermaid()
      .then((m) => {
        m.initialize(THEME_CONFIG);
        return m.render(id, code);
      })
      .then((result) => {
        if (!cancelled && alive.current) setSvg(result.svg);
      })
      .catch((e) => {
        const message = e instanceof Error ? e.message : String(e);
        if (!cancelled && alive.current) setError(message);
      });

    return () => {
      cancelled = true;
      alive.current = false;
    };
  }, [base, code]);

  return (
    <figure className="fade-up overflow-x-auto rounded-xl border border-edge bg-bg2 p-4">
      {!error && (
        <div className="flex justify-center" dangerouslySetInnerHTML={{ __html: svg }} />
      )}
      {error && !svg && (
        <div>
          <p className="text-sm text-err">No se pudo dibujar el diagrama.</p>
          <pre className="mt-2 overflow-x-auto rounded-lg bg-black/40 p-3 text-xs whitespace-pre-wrap text-dim">
            {code}
          </pre>
        </div>
      )}
      {caption && <figcaption className="mt-2 text-center text-[0.8rem] text-dim">{caption}</figcaption>}
    </figure>
  );
}