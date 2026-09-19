"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose-cursos">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: (props) => <a {...props} target="_blank" rel="noopener noreferrer" />,
          pre: (props) => (
            <pre
              {...props}
              className="overflow-x-auto rounded-xl border border-edge bg-[#05070d] px-4 py-3 font-mono text-[0.85rem] leading-relaxed text-txt2"
            />
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}