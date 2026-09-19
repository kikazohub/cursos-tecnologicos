"use client";

import { useRef, useState } from "react";
import { Check, RotateCcw, Sparkles, X } from "lucide-react";

interface Props {
  courseId: string;
  lessonId: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  xp: number;
  onCompleted?: () => void;
}

interface ProgressPayload {
  ok: boolean;
  error?: string;
  xpEarned?: number;
  lessonCompleted?: boolean;
  courseCompleted?: boolean;
  newBadges?: string[];
}

export function Quiz({ courseId, lessonId, question, options, correct, explanation, xp, onCompleted }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const [result, setResult] = useState<"pass" | "fail" | null>(null);
  const [toast, setToast] = useState<ProgressPayload | null>(null);
  const [posting, setPosting] = useState(false);
  const posted = useRef(false);

  const isCorrect = selected === correct;

  function check() {
    if (selected === null || locked) return;
    setLocked(true);
    const pass = isCorrect;
    setResult(pass ? "pass" : "fail");

    if (pass && !posted.current) {
      posted.current = true;
      setPosting(true);
      fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, lessonId, score: pass ? 1 : 0, total: 1 }),
      })
        .then((r) => r.json())
        .then((data: ProgressPayload) => {
          setToast(data);
          if (data.lessonCompleted) onCompleted?.();
        })
        .catch(() => setToast({ ok: false, error: "No se pudo guardar tu progreso" }))
        .finally(() => setPosting(false));
    }
  }

  function retry() {
    setSelected(null);
    setLocked(false);
    setResult(null);
    setToast(null);
  }

  return (
    <div className="fade-up rounded-2xl border border-edge bg-surface p-5">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-lg">🧠</span>
        <h4 className="font-bold text-txt">Mini quiz</h4>
        <span className="ml-auto chip !cursor-default">{xp} XP</span>
      </div>

      <p className="mb-4 font-semibold text-txt">{question}</p>

      <div className="space-y-2.5">
        {options.map((opt, i) => {
          const state = locked ? (i === correct ? "quiz-opt-correct" : i === selected ? "quiz-opt-wrong" : "") : "";
          return (
            <button
              key={i}
              className={`quiz-opt ${locked ? "cursor-default" : ""} ${selected === i && !locked ? "!border-edge2 !text-txt" : ""} ${state}`}
              onClick={() => !locked && setSelected(i)}
              disabled={locked}
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-xs font-bold ${
                  locked && i === correct
                    ? "border-ok text-ok"
                    : locked && i === selected
                      ? "border-err text-err"
                      : "border-edge text-dim"
                }`}
              >
                {String.fromCharCode(97 + i)}
              </span>
              <span>{opt}</span>
            </button>
          );
        })}
      </div>

      {selected !== null && !locked && (
        <button onClick={check} className="btn btn-primary mt-5 w-full py-2.5">
          <Check className="h-4 w-4" /> Comprobar respuesta
        </button>
      )}

      {locked && (
        <div className="mt-5 space-y-3">
          <div
            className={`rounded-xl border p-4 text-sm ${
              result === "pass"
                ? "border-ok/40 bg-ok/10 text-ok"
                : "border-err/40 bg-err/10 text-err"
            }`}
          >
            {result === "pass" ? (
              <div className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0" />
                <div>
                  <p className="font-bold">¡Correcto! +{xp} XP</p>
                  <p className="mt-1 text-txt2">{explanation}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2">
                <X className="mt-0.5 h-4 w-4 shrink-0" />
                <div>
                  <p className="font-bold">Casi… respuesta incorrecta.</p>
                  <p className="mt-1 text-txt2">{explanation}</p>
                </div>
              </div>
            )}
          </div>

          {toast && toast.lessonCompleted && (
            <div className="rounded-xl border border-accent/40 bg-accent/10 p-4 text-sm text-txt">
              <p className="font-bold text-accent">
                {posting ? "Guardando…" : "✓ Lección completada"}
              </p>
              {(toast.xpEarned ?? 0) > 0 && (
                <p className="mt-1 text-txt2">
                  +{toast.xpEarned} XP{toast.courseCompleted ? " · ¡curso completado! (+500 XP)" : ""}
                </p>
              )}
              {(toast.newBadges ?? []).length > 0 && (
                <p className="mt-1 flex flex-wrap items-center gap-1.5 font-semibold">
                  <Sparkles className="h-4 w-4 text-warn" />
                  {toast.newBadges!.map((b) => (
                    <span key={b} className="chip !cursor-default">{b}</span>
                  ))}
                </p>
              )}
            </div>
          )}
          {toast && !toast.ok && toast.error && (
            <p className="text-xs text-err">{toast.error}</p>
          )}

          {result === "fail" && (
            <button onClick={retry} className="btn btn-ghost w-full py-2.5">
              <RotateCcw className="h-4 w-4" /> Reintentar
            </button>
          )}
        </div>
      )}
    </div>
  );
}