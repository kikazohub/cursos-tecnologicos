import { Markdown } from "./markdown";
import { EditableCode } from "./EditableCode";

export function CodeBlock({
  lang,
  title,
  md,
  code,
  run,
  files,
}: {
  lang: string;
  title?: string;
  md?: string;
  code: string;
  run?: boolean;
  files?: Record<string, string>;
}) {
  return (
    <div className="fade-up">
      {md && <div className="mb-3"><Markdown>{md}</Markdown></div>}
      <EditableCode lang={lang} title={title} code={code} run={!!run} files={files} />
    </div>
  );
}