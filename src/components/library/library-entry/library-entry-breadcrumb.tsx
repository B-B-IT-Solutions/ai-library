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
   return (
      <Breadcrumb>
         <BreadcrumbList>
            <BreadcrumbItem>
               <BreadcrumbLink asChild={true}>
                  <Link href="/library">Vorlagen</Link>
               </BreadcrumbLink>
            </BreadcrumbItem>

            {props.variant === "view" && (
               <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                     <BreadcrumbPage
                        className="max-w-[20rem] truncate"
                        title={props.title}
                     >
                        {props.title}
                     </BreadcrumbPage>
                  </BreadcrumbItem>
               </>
            )}

            {props.variant === "edit" && (
               <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                     <BreadcrumbLink
                        asChild={true}
                        className="max-w-[20rem] truncate"
                        title={props.title}
                     >
                        <Link href={`/library/${props.entryId}`}>
                           {props.title}
                        </Link>
                     </BreadcrumbLink>
                  </BreadcrumbItem>
               </>
            )}
         </BreadcrumbList>
      </Breadcrumb>
   );
};
