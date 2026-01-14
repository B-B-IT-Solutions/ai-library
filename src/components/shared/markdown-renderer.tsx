import ReactMarkdown from "react-markdown";

type MarkdownRendererProps = {
   children: string;
   className?: string;
   "data-testid"?: string;
};

export function MarkdownRenderer({
   children,
   className = "text-slate-700 leading-relaxed",
   "data-testid": testid = "markdown-renderer",
}: MarkdownRendererProps) {
   return (
      <div className={className} data-testid={testid}>
         <ReactMarkdown>{children}</ReactMarkdown>
      </div>
   );
}
