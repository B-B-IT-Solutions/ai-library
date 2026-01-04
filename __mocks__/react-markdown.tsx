import { FC, ReactNode } from "react";

type ReactMarkdownProps = {
   children: ReactNode;
};

const ReactMarkdown: FC<ReactMarkdownProps> = ({ children, ...props }) => {
   return (
      <div data-testid="react-markdown-mock" {...props}>
         {children}
      </div>
   );
};

export default ReactMarkdown;
