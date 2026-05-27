import {
   BreadcrumbLinkProps,
   ItemDetailsBreadcrumb,
} from "@/components/shared/breadcrumbs";
import { DCollection } from "@/data/types/domain/collection";
import { rootBreadcrumbUrl } from "../utils/utils";

type Props =
   | {
        variant: "view";
        label: string;
        collection?: DCollection;
        root?: BreadcrumbLinkProps;
     }
   | {
        variant: "edit";
        label: string;
        entryId: string;
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
      return (
         <ItemDetailsBreadcrumb
            root={props.root || defaultRoot}
            variant={props.variant}
            link={{
               href: `${defaultRoot.href}/${props.entryId}`,
               label: props.label,
               tooltip: props.label,
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
