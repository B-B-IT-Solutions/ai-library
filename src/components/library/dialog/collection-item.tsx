"use client";

import { FC } from "react";
import { Folder } from "lucide-react";

import { Badge } from "@/components/shadcn/badge";
import { CallbackFn } from "@/data/types/common";
import { DLibraryCollection } from "@/data/types/domain/library";
import { cn } from "@/lib/utils";

type Props = {
   collection: DLibraryCollection;
   isActive?: boolean;
   onClick: CallbackFn;
};

export const CollectionItem: FC<Props> = ({
   collection,
   isActive,
   onClick,
}) => {
   return (
      <button
         onClick={onClick}
         className={cn(
            "flex w-full items-center justify-between rounded-md px-3 py-2 transition-colors",
            "hover:bg-slate-100",
            isActive && "bg-slate-100"
         )}
         data-testid="collection-item"
      >
         <div className="flex min-w-0 items-center gap-2">
            <Folder
               className="h-4 w-4 flex-shrink-0"
               style={{ color: collection.color || "#64748b" }}
            />
            <span className="truncate text-sm">{collection.name}</span>
         </div>
         {collection.entryCount > 0 && (
            <Badge
               variant="secondary"
               className="h-5 flex-shrink-0 px-2 text-xs"
            >
               {collection.entryCount}
            </Badge>
         )}
      </button>
   );
};
