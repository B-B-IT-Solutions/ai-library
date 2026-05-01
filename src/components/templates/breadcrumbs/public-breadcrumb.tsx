import { Fragment } from "react";
import Link from "next/link";

import {
   Breadcrumb,
   BreadcrumbItem,
   BreadcrumbLink,
   BreadcrumbList,
   BreadcrumbPage,
   BreadcrumbSeparator,
} from "@/components/shadcn/breadcrumb";

export type PublicBreadcrumbLink = {
   href: string;
   label: string;
};

type Props = {
   items: PublicBreadcrumbLink[];
   current: string;
   "data-testid"?: string;
};

export const PublicBreadcrumb = ({
   items,
   current,
   "data-testid": testId = "public-breadcrumb",
}: Props) => {
   return (
      <Breadcrumb data-testid={testId}>
         <BreadcrumbList>
            {items.map((item) => (
               <Fragment key={item.href}>
                  <BreadcrumbItem>
                     <BreadcrumbLink asChild>
                        <Link href={item.href}>{item.label}</Link>
                     </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
               </Fragment>
            ))}
            <BreadcrumbItem>
               <BreadcrumbPage className="max-w-52 truncate" title={current}>
                  {current}
               </BreadcrumbPage>
            </BreadcrumbItem>
         </BreadcrumbList>
      </Breadcrumb>
   );
};
