import { FC, ReactNode } from "react";

type ReactMarkdownProps = {
   children: ReactNode;
   components?: any;
   remarkPlugins?: any[];
   rehypePlugins?: any[];
};

const ReactMarkdown: FC<ReactMarkdownProps> = ({
   children,
   components,
   remarkPlugins,
   rehypePlugins,
   ...props
}) => {
   return (
      <div data-testid="react-markdown-mock" {...props}>
         {children}
      </div>
   );
};

export default ReactMarkdown;
