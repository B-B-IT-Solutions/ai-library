import {
   BreadcrumbLinkProps,
   ItemDetailsBreadcrumb,
} from "@/components/shared/breadcrumbs";

type Props =
   | { variant: "view"; label: string }
   | { variant: "edit"; label: string; collectionId: string }
   | { variant: "new" };

export const CollectionBreadcrumb = (props: Props) => {
   const rootLink: BreadcrumbLinkProps = {
      label: "Sammlungen",
      href: "/collections",
   };

   if (props.variant === "new") {
      return (
         <ItemDetailsBreadcrumb
            root={rootLink}
            variant="new"
            page={{ label: "Neue Sammlung" }}
            data-testid="collection-breadcrumb"
         />
      );
   }

   if (props.variant === "edit") {
      return (
         <ItemDetailsBreadcrumb
            root={rootLink}
            variant="edit"
            link={{
               href: `${rootLink.href}/${props.collectionId}`,
               label: props.label,
               tooltip: props.label,
            }}
            data-testid="collection-breadcrumb"
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
         data-testid="collection-breadcrumb"
      />
   );
};
