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
                     <BreadcrumbPage>{props.title}</BreadcrumbPage>
                  </BreadcrumbItem>
               </>
            )}

            {props.variant === "edit" && (
               <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                     <BreadcrumbLink asChild={true}>
                        <Link href={`/library/${props.entryId}`}>
                           {props.title}
                        </Link>
                     </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                     <BreadcrumbPage>Bearbeiten</BreadcrumbPage>
                  </BreadcrumbItem>
               </>
            )}

            {props.variant === "new" && (
               <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                     <BreadcrumbPage>Neue Vorlage</BreadcrumbPage>
                  </BreadcrumbItem>
               </>
            )}
         </BreadcrumbList>
      </Breadcrumb>
   );
};
