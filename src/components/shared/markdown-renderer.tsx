import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownRendererProps = {
   children: string;
   className?: string;
   "data-testid"?: string;
};

const components: Components = {
   ul: ({ children }) => (
      <ul className="list-disc list-inside space-y-1 my-2">{children}</ul>
   ),
   ol: ({ children }) => (
      <ol className="list-decimal list-inside space-y-1 my-2">{children}</ol>
   ),
   li: ({ children }) => <li className="ml-4">{children}</li>,
   p: ({ children, node }) => {
      const align = node?.properties?.align as string | undefined;
      const textAlignClass =
         align === "center"
            ? "text-center"
            : align === "right"
              ? "text-right"
              : align === "left"
                ? "text-left"
                : "";
      return <p className={`my-2 ${textAlignClass}`}>{children}</p>;
   },
   h1: ({ children, node }) => {
      const align = node?.properties?.align as string | undefined;
      const textAlignClass =
         align === "center"
            ? "text-center"
            : align === "right"
              ? "text-right"
              : align === "left"
                ? "text-left"
                : "";
      return (
         <h1 className={`text-2xl font-bold my-3 ${textAlignClass}`}>
            {children}
         </h1>
      );
   },
   h2: ({ children, node }) => {
      const align = node?.properties?.align as string | undefined;
      const textAlignClass =
         align === "center"
            ? "text-center"
            : align === "right"
              ? "text-right"
              : align === "left"
                ? "text-left"
                : "";
      return (
         <h2 className={`text-xl font-bold my-2 ${textAlignClass}`}>
            {children}
         </h2>
      );
   },
   h3: ({ children, node }) => {
      const align = node?.properties?.align as string | undefined;
      const textAlignClass =
         align === "center"
            ? "text-center"
            : align === "right"
              ? "text-right"
              : align === "left"
                ? "text-left"
                : "";
      return (
         <h3 className={`text-lg font-bold my-2 ${textAlignClass}`}>
            {children}
         </h3>
      );
   },
   code: ({ children, className }) => {
      const isInline = !className;
      if (isInline) {
         return (
            <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm font-mono">
               {children}
            </code>
         );
      }
      return (
         <pre className="bg-slate-100 p-3 rounded my-2 overflow-x-auto">
            <code className="text-sm font-mono">{children}</code>
         </pre>
      );
   },
   blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-slate-300 pl-4 italic my-2">
         {children}
      </blockquote>
   ),
   strong: ({ children }) => <strong className="font-bold">{children}</strong>,
   em: ({ children }) => <em className="italic">{children}</em>,
   del: ({ children }) => (
      <del className="line-through text-slate-500">{children}</del>
   ),
   u: ({ children }) => <u className="underline">{children}</u>,
   hr: () => <hr className="my-4 border-slate-300" />,
   br: () => <br />,
};

export function MarkdownRenderer({
   children,
   className = "text-slate-700 leading-relaxed",
   "data-testid": testid = "markdown-renderer",
}: MarkdownRendererProps) {
   return (
      <div className={className} data-testid={testid}>
         <ReactMarkdown components={components} remarkPlugins={[remarkGfm]}>
            {children}
         </ReactMarkdown>
      </div>
   );
}
