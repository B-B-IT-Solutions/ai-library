import { map } from "es-toolkit/compat";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { DPromptTemplateFieldValues } from "@/data/types/domain/prompt.template";

import { components } from "./components";
import { rehypePlaceholders } from "./plugins/rehype-placeholders";

type Plugin = {
   type: "rehype-placeholders";
   value: DPromptTemplateFieldValues;
};

type Props = {
   children: string;
   plugins?: Plugin[];
   className?: string;
   "data-testid"?: string;
};

export const ReactMd = ({
   children,
   plugins,
   className = "text-slate-700 leading-relaxed",
   "data-testid": testid = "react-md",
}: Props) => {
   const rehypePlugins = toRehypePlugins(plugins);

   return (
      <div className={className} data-testid={testid}>
         <ReactMarkdown
            components={components}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={rehypePlugins}
         >
            {children}
         </ReactMarkdown>
      </div>
   );
};

export const toRehypePlugins = (plugins?: Plugin[]) => {
   return map(plugins, (p) => {
      if (p.type === "rehype-placeholders") {
         return () => rehypePlaceholders(p.value);
      }
      throw new Error("Unrecognized plugin");
   });
};
