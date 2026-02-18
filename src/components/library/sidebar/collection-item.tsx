"use client";

import { Folder } from "lucide-react";
import { FC } from "react";

import { DLibraryCollection } from "@/data/types/domain/library";
import { Badge } from "@/components/shadcn/badge";
import { cn } from "@/lib/utils";

type CollectionItemProps = {
   collection: DLibraryCollection;
   isActive?: boolean;
   onClick: () => void;
};

export const CollectionItem: FC<CollectionItemProps> = ({
   collection,
   isActive,
   onClick,
}) => {
   return (
      <button
         onClick={onClick}
         className={cn(
            "w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors",
            "hover:bg-slate-100",
            isActive && "bg-slate-100"
         )}
      >
         <div className="flex items-center gap-2 min-w-0">
            <Folder
               className="h-4 w-4 flex-shrink-0"
               style={{ color: collection.color || "#64748b" }}
            />
            <span className="text-sm truncate">{collection.name}</span>
         </div>
         {collection.entryCount > 0 && (
            <Badge variant="secondary" className="h-5 px-2 text-xs flex-shrink-0">
               {collection.entryCount}
            </Badge>
         )}
      </button>
   );
};
