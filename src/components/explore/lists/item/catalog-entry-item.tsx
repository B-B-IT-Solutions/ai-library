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
import {
   CatalogEntryMoreOptionsButton,
   UseCatalogEntryLazyButton,
} from "../../buttons";

type Props = {
   entry: DCatalogEntry;
   isAuthenticated: boolean;
   ref?: React.Ref<HTMLDivElement>;
};

export const CatalogEntryItem = ({ entry, isAuthenticated, ref }: Props) => {
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
         ref={ref}
         className="flex flex-col transition-shadow hover:shadow-md"
         data-testid="catalog-entry-item"
      >
         <CardHeader className="pb-3" data-testid="header">
            {category && (
               <Badge
                  variant="secondary"
                  className="w-fit text-xs"
                  data-testid="explore-entry-card-category"
               >
                  {category.name}
               </Badge>
            )}
            <Link
               href={`/explore/${slug}`}
               className="line-clamp-2 text-base leading-snug font-semibold text-slate-900 transition-colors hover:text-slate-600"
               data-testid="entry-title-link"
            >
               {title}
            </Link>
         </CardHeader>

         <CardContent className="flex-1 pb-3" data-testid="content">
            <p className="line-clamp-2 text-sm text-slate-500">{description}</p>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
               <span data-testid="recommended-model">{recommendedModel}</span>
               {fieldsCountSpan()}
               {copyCountSpan()}
            </div>
         </CardContent>

         <CardFooter className="pt-0" data-testid="footer">
            <div className="flex w-full gap-1.5">
               <UseCatalogEntryLazyButton slug={slug} />
               <CatalogEntryMoreOptionsButton
                  entry={entry}
                  isAuthenticated={isAuthenticated}
               />
            </div>
         </CardFooter>
      </Card>
   );
};
