"use client";

import { BookOpen, MoreVertical } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";

type Props = {
   slug: string;
};

export const CatalogEntryMoreOptionsButton = ({ slug }: Props) => {
   return (
      <DropdownMenu data-testid="catalog-entry-more-options-btn">
         <DropdownMenuTrigger asChild={true}>
            <Button
               variant="outline"
               size="icon-sm"
               className="cursor-pointer"
               data-testid="catalog-entry-more-options-trigger-btn"
            >
               <MoreVertical className="h-4 w-4" />
            </Button>
         </DropdownMenuTrigger>
         <DropdownMenuContent align="end">
            <DropdownMenuItem asChild={true}>
               <Link
                  href={`/explore/${slug}`}
                  className="flex cursor-pointer items-center gap-2"
                  data-testid="catalog-entry-more-options-view-item"
               >
                  <BookOpen className="h-4 w-4" />
                  Ansehen
               </Link>
            </DropdownMenuItem>
         </DropdownMenuContent>
      </DropdownMenu>
   );
};
