import {
   BreadcrumbLinkProps,
   ItemDetailsBreadcrumb,
} from "@/components/shared/breadcrumbs";

type Props =
   | {
        variant: "view";
        label: string;
        root?: BreadcrumbLinkProps;
     }
   | {
        variant: "edit";
        label: string;
        entryId: string;
        root?: BreadcrumbLinkProps;
     }
   | {
        variant: "new";
        root?: BreadcrumbLinkProps;
     };

export const TemplateBreadcrumb = (props: Props) => {
   const defaultRoot: BreadcrumbLinkProps = {
      label: "Vorlagen",
      href: "/templates",
   };

   if (props.variant === "new") {
      return (
         <ItemDetailsBreadcrumb
            root={props.root || defaultRoot}
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
