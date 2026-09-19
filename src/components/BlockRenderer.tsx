import type { Block } from "@/lib/content/types";
import { Markdown } from "./markdown";
import { CodeBlock } from "./CodeBlock";
import { TerminalBlock } from "./TerminalBlock";
import { DemoBlock } from "./DemoBlock";
import { Mermaid } from "./Mermaid";
import { Quiz } from "./Quiz";

const CALLOUT_STYLES: Record<string, { border: string; bg: string; icon: string }> = {
  info: { border: "border-inf/40", bg: "bg-inf/10", icon: "💡" },
  tip: { border: "border-ok/40", bg: "bg-ok/10", icon: "💡" },
  warning: { border: "border-warn/40", bg: "bg-warn/10", icon: "⚠️" },
  danger: { border: "border-err/40", bg: "bg-err/10", icon: "🚨" },
};

export function BlockRenderer({
  block,
  courseId,
  lessonId,
  lessonXp,
}: {
  block: Block;
  courseId: string;
  lessonId: string;
  lessonXp: number;
}) {
  switch (block.t) {
    case "theory":
      return <Markdown>{block.md}</Markdown>;

    case "code":
      return (
        <CodeBlock
          lang={block.lang}
          title={block.title}
          md={block.md}
          code={block.code}
          run={block.run}
          files={block.files}
        />
      );

    case "terminal":
      return <TerminalBlock title={block.title} md={block.md} cmd={block.cmd} />;

    case "demo":
      return <DemoBlock title={block.title} md={block.md} lines={block.lines} />;

    case "diagram":
      return <Mermaid code={block.mermaid} caption={block.caption} />;

    case "callout": {
      const style = CALLOUT_STYLES[block.kind] ?? CALLOUT_STYLES.info;
      return (
        <div className={`fade-up rounded-xl border ${style.border} ${style.bg} p-4`}>
          {block.title && (
            <p className="mb-1.5 font-bold text-txt">
              {style.icon} {block.title}
            </p>
          )}
          <Markdown>{block.md}</Markdown>
        </div>
      );
    }

    case "quiz":
      return (
        <Quiz
          courseId={courseId}
          lessonId={lessonId}
          question={block.question}
          options={block.options}
          correct={block.correct}
          explanation={block.explanation}
          xp={lessonXp}
        />
      );

    default:
      return null;
  }
}