import { BookOpen, Copy, LayoutList, MoreVertical } from "lucide-react";
import Link from "next/link";

import { CatalogEntryUseLazyButton } from "@/components/explore/buttons";
import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import {
   Card,
   CardContent,
   CardFooter,
   CardHeader,
} from "@/components/shadcn/card";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import { DCatalogEntry } from "@/data/types/domain/catalog";
import { cn } from "@/lib/utils";

type Props = {
   entry: DCatalogEntry;
   className?: string;
};

export const ExploreEntryCard = ({ entry, className }: Props) => {
   const {
      slug,
      title,
      description,
      category,
      recommendedModel,
      fields,
      copyCount,
   } = entry;

   return (
      <Card
         className={cn(
            "flex flex-col transition-shadow hover:shadow-md",
            className
         )}
         data-testid="explore-entry-card"
      >
         <CardHeader className="pb-3">
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
               data-testid="explore-entry-card-title"
            >
               {title}
            </Link>
         </CardHeader>

         <CardContent className="flex-1 pb-3">
            <p className="line-clamp-2 text-sm text-slate-500">{description}</p>

            <div className="mt-3 flex items-center gap-4 text-xs text-slate-400">
               <span
                  className="flex items-center gap-1"
                  data-testid="explore-entry-card-field-count"
               >
                  <LayoutList className="h-3.5 w-3.5" />
                  {fields.length} {fields.length === 1 ? "Feld" : "Felder"}
               </span>
               {copyCount > 0 && (
                  <span className="flex items-center gap-1">
                     <Copy className="h-3.5 w-3.5" />
                     {copyCount}× übernommen
                  </span>
               )}
            </div>
         </CardContent>

         <CardFooter className="pt-0">
            <div className="flex w-full gap-1.5">
               <CatalogEntryUseLazyButton slug={slug} />
               <DropdownMenu data-testid="explore-entry-card-menu">
                  <DropdownMenuTrigger asChild={true}>
                     <Button
                        variant="outline"
                        size="icon-sm"
                        className="cursor-pointer"
                        data-testid="explore-entry-card-menu-trigger"
                     >
                        <MoreVertical className="h-4 w-4" />
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                     <DropdownMenuItem asChild>
                        <Link
                           href={`/explore/${slug}`}
                           className="flex items-center gap-2"
                           data-testid="explore-entry-card-view-link"
                        >
                           <BookOpen className="h-4 w-4" />
                           Ansehen
                        </Link>
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            </div>
         </CardFooter>
      </Card>
   );
};
