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
        collection?: DCollectionPreview;
        root?: BreadcrumbLinkProps;
     }
   | {
        variant: "edit";
        prompt: DPrompt;
        collection?: DCollectionPreview;
        root?: BreadcrumbLinkProps;
     }
   | {
        variant: "new";
        collection?: DCollectionPreview;
        root?: BreadcrumbLinkProps;
     };

export const PromptBreadcrumb = (props: Props) => {
   const defaultRoot: BreadcrumbLinkProps = {
      label: props.collection?.name || "Prompts",
      href: breadcrumbRootUrl(props.collection),
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
      const { prompt, variant, root, collection } = props;
      return (
         <ItemDetailsBreadcrumb
            root={root || defaultRoot}
            variant={variant}
            link={{
               href: viewPromptUrl(prompt, collection?.id),
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
