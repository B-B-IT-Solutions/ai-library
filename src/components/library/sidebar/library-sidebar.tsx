"use client";

import { ChevronLeft, ChevronRight, Clock, Heart, Library } from "lucide-react";
import { FC, useState } from "react";

import { useLoadLibraryCollections } from "@/data/ts-queries/library";
import { Button } from "@/components/shadcn/button";
import { Separator } from "@/components/shadcn/separator";
import { cn } from "@/lib/utils";

import { useLibraryFilters } from "../filters/library-filters-context";
import { CollectionItem } from "./collection-item";
import { CreateCollectionDialog } from "./create-collection-dialog";

export const LibrarySidebar: FC = () => {
   const [isCollapsed, setIsCollapsed] = useState(false);
   const { data: collections = [] } = useLoadLibraryCollections();
   const { filters, setFilters } = useLibraryFilters();

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

   if (isCollapsed) {
      return (
         <div className="w-16 border-r bg-white p-2 flex flex-col items-center gap-2">
            <Button
               variant="ghost"
               size="icon"
               onClick={() => setIsCollapsed(false)}
               className="h-8 w-8"
            >
               <ChevronRight className="h-4 w-4" />
            </Button>
            <Separator />
            <button
               onClick={() => handleQuickLinkClick({})}
               className="p-2 rounded-md hover:bg-slate-100 transition-colors"
               title="Alle Vorlagen"
            >
               <Library className="h-5 w-5 text-slate-600" />
            </button>
            <button
               onClick={() => handleQuickLinkClick({ isFavorite: true })}
               className="p-2 rounded-md hover:bg-slate-100 transition-colors"
               title="Favoriten"
            >
               <Heart className="h-5 w-5 text-slate-600" />
            </button>
         </div>
      );
   }

   return (
      <div className="w-64 border-r bg-white flex flex-col h-full">
         {/* Header */}
         <div className="p-4 border-b flex items-center justify-between">
            <h2 className="font-semibold text-sm">Meine Bibliothek</h2>
            <Button
               variant="ghost"
               size="icon"
               onClick={() => setIsCollapsed(true)}
               className="h-8 w-8"
            >
               <ChevronLeft className="h-4 w-4" />
            </Button>
         </div>

         {/* Quick Links */}
         <div className="p-4 space-y-1">
            <button
               onClick={() => handleQuickLinkClick({})}
               className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
                  "hover:bg-slate-100",
                  !filters.isFavorite &&
                     !activeCollectionIds.length &&
                     "bg-slate-100"
               )}
            >
               <Library className="h-4 w-4 text-slate-600" />
               <span className="text-sm">Alle Vorlagen</span>
            </button>
            <button
               onClick={() => handleQuickLinkClick({ isFavorite: true })}
               className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
                  "hover:bg-slate-100",
                  filters.isFavorite && "bg-slate-100"
               )}
            >
               <Heart className="h-4 w-4 text-slate-600" />
               <span className="text-sm">Favoriten</span>
            </button>
            <button
               onClick={() => handleQuickLinkClick({})}
               className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-100 transition-colors"
            >
               <Clock className="h-4 w-4 text-slate-600" />
               <span className="text-sm">Zuletzt hinzugefügt</span>
            </button>
         </div>

         <Separator />

         {/* Collections */}
         <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1 mb-4">
               <h3 className="text-xs font-semibold text-slate-500 uppercase px-3 mb-2">
                  Sammlungen
               </h3>
               {collections.length === 0 ? (
                  <p className="text-sm text-slate-500 px-3 py-2">
                     Keine Sammlungen vorhanden
                  </p>
               ) : (
                  collections.map((collection) => (
                     <CollectionItem
                        key={collection.id}
                        collection={collection}
                        isActive={activeCollectionIds.includes(collection.id)}
                        onClick={() => toggleCollection(collection.id)}
                     />
                  ))
               )}
            </div>
            <CreateCollectionDialog />
         </div>
      </div>
   );
};
