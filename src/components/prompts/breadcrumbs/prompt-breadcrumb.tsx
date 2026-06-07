import {
   BreadcrumbLinkProps,
   ItemDetailsBreadcrumb,
} from "@/components/shared/breadcrumbs";
import { DCollectionPreview } from "@/data/types/domain/collection";
import { DPrompt } from "@/data/types/domain/prompt";
import { breadcrumbRootUrl, viewPromptUrl } from "../utils/utils";

type Props =
   | {
        variant: "view";
        label: string;
        currentCollection?: DCollectionPreview;
        root?: BreadcrumbLinkProps;
     }
   | {
        variant: "edit";
        prompt: DPrompt;
        currentCollection?: DCollectionPreview;
        root?: BreadcrumbLinkProps;
     }
   | {
        variant: "new";
        currentCollection?: DCollectionPreview;
        root?: BreadcrumbLinkProps;
     };

export const PromptBreadcrumb = (props: Props) => {
   const defaultRoot: BreadcrumbLinkProps = {
      label: props.currentCollection?.name || "Prompts",
      href: breadcrumbRootUrl(props.currentCollection),
   };

   if (props.variant === "new") {
      return (
         <ItemDetailsBreadcrumb
            root={props.root || defaultRoot}
            variant={props.variant}
            page={{
               label: "Neuer Prompt",
            }}
            data-testid="template-breadcrumb"
         />
      );
   }

   if (props.variant === "edit") {
      const { prompt, variant, root, currentCollection } = props;
      return (
         <ItemDetailsBreadcrumb
            root={root || defaultRoot}
            variant={variant}
            link={{
               href: viewPromptUrl(prompt, currentCollection),
               label: prompt.title,
               tooltip: prompt.title,
            }}
            data-testid="template-breadcrumb"
         />
      );
   }

   return (
      <ItemDetailsBreadcrumb
         root={props.root || defaultRoot}
         variant={props.variant}
         page={{
            label: props.label,
            tooltip: props.label,
         }}
         data-testid="template-breadcrumb"
      />
   );
};
