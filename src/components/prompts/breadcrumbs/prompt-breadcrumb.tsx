import {
   BreadcrumbLinkProps,
   ItemDetailsBreadcrumb,
} from "@/components/shared/breadcrumbs";
import { DCollection } from "@/data/types/domain/collection";
import { DPrompt } from "@/data/types/domain/prompt";
import { rootBreadcrumbUrl, viewPromptUrl } from "../utils/utils";

type Props =
   | {
        variant: "view";
        label: string;
        collection?: DCollection;
        root?: BreadcrumbLinkProps;
     }
   | {
        variant: "edit";
        prompt: DPrompt;
        collection?: DCollection;
        root?: BreadcrumbLinkProps;
     }
   | {
        variant: "new";
        collection?: DCollection;
        root?: BreadcrumbLinkProps;
     };

export const PromptBreadcrumb = (props: Props) => {
   const defaultRoot: BreadcrumbLinkProps = {
      label: props.collection?.name || "Prompts",
      href: rootBreadcrumbUrl(props.collection),
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
