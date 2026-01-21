import { FC } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { components } from "./react-md-components";

type ReactMdProps = {
   children: string;
   className?: string;
   "data-testid"?: string;
};

export const ReactMd: FC<ReactMdProps> = ({
   children,
   className = "text-slate-700 leading-relaxed",
   "data-testid": testid = "react-md",
}) => {
   return (
      <div className={className} data-testid={testid}>
         <ReactMarkdown components={components} remarkPlugins={[remarkGfm]}>
            {children}
         </ReactMarkdown>
      </div>
   );
};
