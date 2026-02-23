"use client";

import { FC, useState } from "react";
import { filter, includes, isEmpty } from "es-toolkit/compat";
import { Folder, Plus } from "lucide-react";
import { debounce, useQueryState } from "nuqs";

import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import { useLoadLibraryCollections } from "@/data/ts-queries/library";
import { DLibraryEntriesFilter } from "@/data/types/domain/library";
import { cn } from "@/lib/utils";
import { LibraryCollectionCreateDialog } from "../dialog";
import { librarySearchParams } from "../search-params";

type Props = {
   filters: DLibraryEntriesFilter;
};

export const LibraryQuickNav: FC<Props> = () => {
   const [f_collectionIds, setCollectionIds] = useQueryState(
      "f_collectionIds",
      librarySearchParams["f_collectionIds"]
   );

   const { data: collections = [] } = useLoadLibraryCollections();
   const [showCreateDialog, setShowCreateDialog] = useState(false);

   const toggleCollection = (collectionId: string) => {
      const isActive = includes(f_collectionIds, collectionId);
      const newCollectionIds = isActive
         ? filter(f_collectionIds, (id) => id !== collectionId)
         : [...f_collectionIds, collectionId];

      setCollectionIds(newCollectionIds, {
         limitUrlUpdates: debounce(400),
      });
   };

   return (
      <>
         <div className="flex flex-wrap items-center gap-2">
            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <Button
                     variant={!isEmpty(f_collectionIds) ? "default" : "outline"}
                     size="sm"
                     className="gap-2"
                  >
                     <Folder className="h-4 w-4" />
                     Sammlungen
                     {!isEmpty(f_collectionIds) && (
                        <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                           {f_collectionIds.length}
                        </Badge>
                     )}
                  </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="start" className="w-56">
                  {collections.length === 0 ? (
                     <div className="px-2 py-6 text-center text-sm text-slate-500">
                        Keine Sammlungen vorhanden
                     </div>
                  ) : (
                     collections.map((collection) => {
                        const isActive = includes(
                           f_collectionIds,
                           collection.id
                        );
                        return (
                           <DropdownMenuItem
                              key={collection.id}
                              onClick={() => toggleCollection(collection.id)}
                              className={cn(
                                 "cursor-pointer",
                                 isActive && "bg-slate-100"
                              )}
                           >
                              <div className="flex w-full items-center justify-between">
                                 <div className="flex min-w-0 items-center gap-2">
                                    <Folder
                                       className="h-4 w-4 flex-shrink-0"
                                       style={{
                                          color: collection.color || "#64748b",
                                       }}
                                    />
                                    <span className="truncate">
                                       {collection.name}
                                    </span>
                                 </div>
                                 {collection.entryCount > 0 && (
                                    <Badge
                                       variant="secondary"
                                       className="ml-2 h-5 flex-shrink-0 px-2 text-xs"
                                    >
                                       {collection.entryCount}
                                    </Badge>
                                 )}
                              </div>
                           </DropdownMenuItem>
                        );
                     })
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                     onClick={() => setShowCreateDialog(true)}
                     className="cursor-pointer text-blue-600"
                  >
                     <Plus className="mr-2 h-4 w-4" />
                     Neue Sammlung
                  </DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>
         </div>

         <LibraryCollectionCreateDialog
            open={showCreateDialog}
            onOpenChange={setShowCreateDialog}
         />
      </>
   );
};
