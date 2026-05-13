import {
   BreadcrumbLinkProps,
   ItemDetailsBreadcrumb,
} from "@/components/shared/breadcrumbs";

type Props =
   | { variant: "view"; label: string }
   | { variant: "edit"; label: string; promptId: string }
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
               label: props.label,
               tooltip: props.label,
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
            label: props.label,
            tooltip: props.label,
         }}
         data-testid="prompt-breadcrumb"
      />
   );
};
