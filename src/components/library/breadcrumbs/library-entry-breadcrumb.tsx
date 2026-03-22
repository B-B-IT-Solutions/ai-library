import {
   BreadcrumbLinkProps,
   ItemDetailsBreadcrumb,
} from "@/components/shared/breadcrumbs";

type Props =
   | { variant: "view"; title: string }
   | { variant: "edit"; title: string; entryId: string }
   | { variant: "new" };

export const LibraryEntryBreadcrumb = (props: Props) => {
   const rootLink: BreadcrumbLinkProps = {
      label: "Vorlagen",
      href: "/library",
   };

   if (props.variant === "new") {
      return (
         <ItemDetailsBreadcrumb
            root={rootLink}
            variant={props.variant}
            page={{
               label: "Neue Vorlage",
            }}
            data-testid="libary-entry-breadcrumb"
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
               label: props.title,
               tooltip: props.title,
            }}
            data-testid="libary-entry-breadcrumb"
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
         data-testid="libary-entry-breadcrumb"
      />
   );
};
