import { Markdown } from "./markdown";

export function DemoBlock({
  title,
  md,
  lines,
}: {
  title?: string;
  md?: string;
  lines: Array<{ prompt: string; out?: string[]; note?: string }>;
}) {
  return (
    <div className="fade-up space-y-3">
      {md && <Markdown>{md}</Markdown>}
      <div className="term">
        <div className="term-head">
          <div className="flex items-center gap-2">
            <span className="term-dots">
              <span className="term-dot bg-[#ff5f57]" />
              <span className="term-dot bg-[#febc2e]" />
              <span className="term-dot bg-[#28c840]" />
            </span>
            <span className="text-[0.78rem] font-semibold text-dim">
              {title ?? "demo"}
            </span>
          </div>
        </div>
        <div className="term-body">
          {lines.map((l, i) => (
            <div key={i} className="mb-2">
              <div>
                <span className="text-accent">$ </span>
                <span className="text-txt">{l.prompt}</span>
              </div>
              {l.out?.map((o, j) => (
                <div key={j} className="text-dim whitespace-pre-wrap">
                  {o}
                </div>
              ))}
              {l.note && <div className="mt-1 text-xs text-warn">▸ {l.note}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}