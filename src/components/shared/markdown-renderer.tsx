import ReactMarkdown from "react-markdown";

type MarkdownRendererProps = {
   content: string;
   className?: string;
};

export function MarkdownRenderer({
   content,
   className = "text-slate-700 leading-relaxed",
}: MarkdownRendererProps) {
   return (
      <div className={className}>
         <ReactMarkdown>{content}</ReactMarkdown>
      </div>
   );
}
