import Link from "next/link";

import {
   Breadcrumb,
   BreadcrumbItem,
   BreadcrumbLink,
   BreadcrumbList,
   BreadcrumbPage,
   BreadcrumbSeparator,
} from "@/components/shadcn/breadcrumb";

type Props =
   | { variant: "view"; title: string }
   | { variant: "edit"; title: string; entryId: string }
   | { variant: "new" };

export const LibraryEntryBreadcrumb = (props: Props) => {
   const rootItem = () => {
      return (
         <BreadcrumbItem>
            <BreadcrumbLink asChild={true}>
               <Link href="/library" data-testid="root-link">
                  Vorlagen
               </Link>
            </BreadcrumbLink>
         </BreadcrumbItem>
      );
   };

   const listItem = () => {
      if (props.variant == "new") {
         return (
            <BreadcrumbItem>
               <BreadcrumbPage>Neue Vorlage</BreadcrumbPage>
            </BreadcrumbItem>
         );
      }

      if (props.variant == "edit") {
         return (
            <>
               <BreadcrumbItem>
                  <BreadcrumbLink
                     asChild={true}
                     className="max-w-40 truncate"
                     title={props.title}
                  >
                     <Link
                        href={`/library/${props.entryId}`}
                        data-testid="item-link"
                     >
                        {props.title}
                     </Link>
                  </BreadcrumbLink>
               </BreadcrumbItem>
               <BreadcrumbSeparator />
               <BreadcrumbItem>
                  <BreadcrumbPage>Bearbeiten</BreadcrumbPage>
               </BreadcrumbItem>
            </>
         );
      }

      return (
         <BreadcrumbItem>
            <BreadcrumbPage className="max-w-40 truncate" title={props.title}>
               {props.title}
            </BreadcrumbPage>
         </BreadcrumbItem>
      );
   };

   return (
      <Breadcrumb data-testid="libary-entry-breadcrumbs">
         <BreadcrumbList>
            {rootItem()}
            <BreadcrumbSeparator />
            {listItem()}
         </BreadcrumbList>
      </Breadcrumb>
   );
};
