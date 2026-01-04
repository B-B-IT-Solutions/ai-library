import ReactMarkdown from "react-markdown";

type MarkdownRendererProps = {
   children: string;
   className?: string;
};

export function MarkdownRenderer({
   children,
   className = "text-slate-700 leading-relaxed",
}: MarkdownRendererProps) {
   return (
      <div className={className} data-testid="markdown-renderer">
         <ReactMarkdown>{children}</ReactMarkdown>
      </div>
   );
}
