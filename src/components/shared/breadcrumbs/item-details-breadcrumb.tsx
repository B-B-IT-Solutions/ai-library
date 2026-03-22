import Link from "next/link";

import {
   Breadcrumb,
   BreadcrumbItem,
   BreadcrumbLink,
   BreadcrumbList,
   BreadcrumbPage,
   BreadcrumbSeparator,
} from "@/components/shadcn/breadcrumb";

export type BreadcrumbLinkProps = {
   href: string;
   label: string;
   tooltip?: string;
};

export type BreadcrumbPageProps = { label: string; tooltip?: string };

type Props = {
   root: BreadcrumbLinkProps;
   "data-testid"?: string;
} & (
   | { variant: "new"; page: BreadcrumbPageProps }
   | { variant: "view"; page: BreadcrumbPageProps }
   | { variant: "edit"; link: BreadcrumbLinkProps }
);

export const ItemDetailsBreadcrumb = (props: Props) => {
   const { "data-testid": testId = "item-details-breadcrumb" } = props;

   const rootItem = () => {
      return (
         <BreadcrumbItem>
            <BreadcrumbLink asChild={true}>
               <Link href={props.root.href} data-testid="root-link">
                  {props.root.label}
               </Link>
            </BreadcrumbLink>
         </BreadcrumbItem>
      );
   };

   const listItem = () => {
      if (props.variant == "new") {
         return (
            <BreadcrumbItem>
               <BreadcrumbPage>{props.page.label}</BreadcrumbPage>
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
                     title={props.link.tooltip}
                  >
                     <Link href={props.link.href} data-testid="item-link">
                        {props.link.label}
                     </Link>
                  </BreadcrumbLink>
               </BreadcrumbItem>
            </>
         );
      }

      return (
         <BreadcrumbItem>
            <BreadcrumbPage
               className="max-w-40 truncate"
               title={props.page.tooltip}
            >
               {props.page.label}
            </BreadcrumbPage>
         </BreadcrumbItem>
      );
   };

   return (
      <Breadcrumb data-testid={testId}>
         <BreadcrumbList>
            {rootItem()}
            <BreadcrumbSeparator />
            {listItem()}
         </BreadcrumbList>
      </Breadcrumb>
   );
};
