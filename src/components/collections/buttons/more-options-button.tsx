"use client";

import { MoreVertical } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import { DCollection } from "@/data/types/domain/collection";

import { DeleteCollectionButton } from "./delete-collection-button";
import { EditCollectionButton } from "./edit-collection-button";

type Props = {
   collection: DCollection;
};

export const MoreOptionsButton = ({ collection }: Props) => {
   return (
      <DropdownMenu data-testid="more-options-btn">
         <DropdownMenuTrigger asChild={true}>
            <Button
               variant="outline"
               size="icon-sm"
               className="cursor-pointer"
               data-testid="more-options-trigger-btn"
            >
               <MoreVertical className="h-4 w-4" />
            </Button>
         </DropdownMenuTrigger>
         <DropdownMenuContent align="end">
            <EditCollectionButton collection={collection} />
            <DropdownMenuSeparator />
            <DeleteCollectionButton collection={collection} />
         </DropdownMenuContent>
      </DropdownMenu>
   );
};
