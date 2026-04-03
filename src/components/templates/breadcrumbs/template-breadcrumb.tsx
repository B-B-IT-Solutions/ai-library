import {
   BreadcrumbLinkProps,
   ItemDetailsBreadcrumb,
} from "@/components/shared/breadcrumbs";

type Props =
   | { variant: "view"; label: string }
   | { variant: "edit"; label: string; entryId: string }
   | { variant: "new" };

export const TemplateBreadcrumb = (props: Props) => {
   const rootLink: BreadcrumbLinkProps = {
      label: "Vorlagen",
      href: "/templates",
   };

   if (props.variant === "new") {
      return (
         <ItemDetailsBreadcrumb
            root={rootLink}
            variant={props.variant}
            page={{
               label: "Neue Vorlage",
            }}
            data-testid="template-breadcrumb"
         />
      );
   }

   if (props.variant === "edit") {
      return (
         <ItemDetailsBreadcrumb
            root={rootLink}
            variant={props.variant}
            link={{
               href: `${rootLink.href}/${props.entryId}`,
               label: props.label,
               tooltip: props.label,
            }}
            data-testid="template-breadcrumb"
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
         data-testid="template-breadcrumb"
      />
   );
};
