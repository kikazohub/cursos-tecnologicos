import { Markdown } from "./markdown";
import { EditableCode } from "./EditableCode";

export function TerminalBlock({
  title,
  md,
  cmd,
}: {
  title?: string;
  md?: string;
  cmd: string;
}) {
  return (
    <div className="fade-up space-y-3">
      {md && <Markdown>{md}</Markdown>}
      <EditableCode lang="shell" title={title ?? "terminal bash"} code={cmd} run variant="shell" />
    </div>
  );
}