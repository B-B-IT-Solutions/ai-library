import { ItemDetailsBreadcrumb } from "@/components/shared/breadcrumbs";
import { BreadcrumbLinkProps } from "@/components/shared/breadcrumbs/item-details-breadcrumb";

type Props =
   | { variant: "view"; title: string }
   | { variant: "edit"; title: string; promptId: string }
   | { variant: "new" };

export const PromptBreadcrumb = (props: Props) => {
   const rootLink: BreadcrumbLinkProps = {
      label: "Prompts",
      href: "/prompts",
   };

   if (props.variant === "new") {
      return (
         <ItemDetailsBreadcrumb
            root={rootLink}
            variant={props.variant}
            page={{
               label: "Neuer Prompt",
            }}
            data-testid="prompt-breadcrumb"
         />
      );
   }

   if (props.variant === "edit") {
      return (
         <ItemDetailsBreadcrumb
            root={rootLink}
            variant={props.variant}
            link={{
               href: `${rootLink.href}/${props.promptId}`,
               label: props.title,
               tooltip: props.title,
            }}
            data-testid="prompt-breadcrumb"
         />
      );
   }

   return (
      <ItemDetailsBreadcrumb
         root={rootLink}
         variant={props.variant}
         page={{
            label: props.title,
            tooltip: props.title,
         }}
         data-testid="prompt-breadcrumb"
      />
   );
};
