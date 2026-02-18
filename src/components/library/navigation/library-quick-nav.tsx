"use client";

import { Clock, Folder, Heart, Library, Plus } from "lucide-react";
import { FC, useState } from "react";

import { useLoadLibraryCollections } from "@/data/ts-queries/library";
import { Button } from "@/components/shadcn/button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import { Badge } from "@/components/shadcn/badge";
import { cn } from "@/lib/utils";

import { useLibraryFilters } from "../filters/library-filters-context";
import { CreateCollectionDialog } from "../sidebar/create-collection-dialog";

export const LibraryQuickNav: FC = () => {
   const { data: collections = [] } = useLoadLibraryCollections();
   const { filters, setFilters } = useLibraryFilters();
   const [showCreateDialog, setShowCreateDialog] = useState(false);

   const activeCollectionIds = filters.collectionIds || [];

   const handleQuickLinkClick = (filter: any) => {
      setFilters(filter);
   };

   const toggleCollection = (collectionId: string) => {
      const isActive = activeCollectionIds.includes(collectionId);
      const newCollectionIds = isActive
         ? activeCollectionIds.filter((id) => id !== collectionId)
         : [...activeCollectionIds, collectionId];

      setFilters({
         collectionIds: newCollectionIds.length > 0 ? newCollectionIds : undefined,
      });
   };

   const isAllActive = !filters.isFavorite && !activeCollectionIds.length;
   const isFavoritesActive = !!filters.isFavorite;

   return (
      <>
         <div className="flex items-center gap-2 flex-wrap">
            {/* Quick Links */}
            <Button
               variant={isAllActive ? "default" : "outline"}
               size="sm"
               onClick={() => handleQuickLinkClick({})}
               className="gap-2"
            >
               <Library className="h-4 w-4" />
               Alle
            </Button>

            <Button
               variant={isFavoritesActive ? "default" : "outline"}
               size="sm"
               onClick={() => handleQuickLinkClick({ isFavorite: true })}
               className="gap-2"
            >
               <Heart className="h-4 w-4" />
               Favoriten
            </Button>

            <Button
               variant="outline"
               size="sm"
               onClick={() => handleQuickLinkClick({})}
               className="gap-2"
            >
               <Clock className="h-4 w-4" />
               Zuletzt hinzugefügt
            </Button>

            {/* Collections Dropdown */}
            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <Button
                     variant={activeCollectionIds.length > 0 ? "default" : "outline"}
                     size="sm"
                     className="gap-2"
                  >
                     <Folder className="h-4 w-4" />
                     Sammlungen
                     {activeCollectionIds.length > 0 && (
                        <Badge variant="secondary" className="h-5 px-1.5 ml-1">
                           {activeCollectionIds.length}
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
                        const isActive = activeCollectionIds.includes(collection.id);
                        return (
                           <DropdownMenuItem
                              key={collection.id}
                              onClick={() => toggleCollection(collection.id)}
                              className={cn(
                                 "cursor-pointer",
                                 isActive && "bg-slate-100"
                              )}
                           >
                              <div className="flex items-center justify-between w-full">
                                 <div className="flex items-center gap-2 min-w-0">
                                    <Folder
                                       className="h-4 w-4 flex-shrink-0"
                                       style={{ color: collection.color || "#64748b" }}
                                    />
                                    <span className="truncate">{collection.name}</span>
                                 </div>
                                 {collection.entryCount > 0 && (
                                    <Badge
                                       variant="secondary"
                                       className="h-5 px-2 text-xs ml-2 flex-shrink-0"
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
                     <Plus className="h-4 w-4 mr-2" />
                     Neue Sammlung
                  </DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>
         </div>

         {/* Create Collection Dialog */}
         {showCreateDialog && (
            <CreateCollectionDialog
               open={showCreateDialog}
               onOpenChange={setShowCreateDialog}
            />
         )}
      </>
   );
};
