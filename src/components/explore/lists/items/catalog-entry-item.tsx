import { isEmpty } from "es-toolkit/compat";
import { Copy, LayoutList } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/shadcn/badge";
import {
   Card,
   CardContent,
   CardFooter,
   CardHeader,
} from "@/components/shadcn/card";
import { DCatalogEntry } from "@/data/types/domain/catalog";
import { cn } from "@/lib/utils";
import {
   CatalogEntryMoreOptionsButton,
   UseCatalogEntryLazyButton,
} from "../../buttons";

type Props = {
   entry: DCatalogEntry;
   className?: string;
};

export const CatalogEntryItem = ({ entry, className }: Props) => {
   const {
      slug,
      title,
      description,
      category,
      recommendedModel,
      fields,
      copyCount,
   } = entry;

   const fieldsCountSpan = () => {
      if (!isEmpty(fields)) {
         return (
            <span
               className="flex items-center gap-1"
               data-testid="fields-count"
            >
               <LayoutList className="h-3.5 w-3.5" />
               {fields.length} {fields.length === 1 ? "Feld" : "Felder"}
            </span>
         );
      }
   };

   const copyCountSpan = () => {
      if (copyCount > 0) {
         return (
            <span className="flex items-center gap-1" data-testid="copy-count">
               <Copy className="h-3.5 w-3.5" />
               {copyCount}× übernommen
            </span>
         );
      }
   };

   return (
      <Card
         className={cn(
            "flex flex-col transition-shadow hover:shadow-md",
            className
         )}
         data-testid="catalog-entry-item"
      >
         <CardHeader className="pb-3" data-testid="header">
            <div className="flex items-start justify-between gap-2">
               <div className="flex flex-wrap gap-1.5">
                  {category && (
                     <Badge
                        variant="secondary"
                        className="text-xs"
                        data-testid="explore-entry-card-category"
                     >
                        {category.name}
                     </Badge>
                  )}
                  <Badge variant="outline" className="text-xs font-normal">
                     {recommendedModel}
                  </Badge>
               </div>
            </div>
            <Link
               href={`/explore/${slug}`}
               className="mt-2 line-clamp-2 text-base leading-snug font-semibold text-slate-900 transition-colors hover:text-slate-600"
               data-testid="entry-title-link"
            >
               {title}
            </Link>
         </CardHeader>

         <CardContent className="flex-1 pb-3" data-testid="content">
            <p className="line-clamp-2 text-sm text-slate-500">{description}</p>

            <div className="mt-3 flex items-center gap-4 text-xs text-slate-400">
               {fieldsCountSpan()}
               {copyCountSpan()}
            </div>
         </CardContent>

         <CardFooter className="pt-0" data-testid="footer">
            <div className="flex w-full gap-1.5">
               <UseCatalogEntryLazyButton slug={slug} />
               <CatalogEntryMoreOptionsButton entry={entry} />
            </div>
         </CardFooter>
      </Card>
   );
};
