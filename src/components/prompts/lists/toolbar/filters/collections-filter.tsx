"use client";

import { useEffect, useState } from "react";
import { filter, includes, isEmpty } from "es-toolkit/compat";
import { Folder } from "lucide-react";
import { useQueryState } from "nuqs";
import { useDebouncedCallback } from "use-debounce";

import { Badge } from "@/components/shadcn/badge";
import { Checkbox } from "@/components/shadcn/checkbox";
import { Label } from "@/components/shadcn/label";
import { useLoadCollections } from "@/data/ts-queries/library";
import { DCollection } from "@/data/types/domain/collection";
import { templatesSearchParams } from "../../../search-params";

export const CollectionsFilter = () => {
   const [urlCollections, setUrlCollections] = useQueryState(
      "f_collectionIds",
      templatesSearchParams["f_collectionIds"]
   );
   const [f_collectionIds, setCollectionIds] = useState(urlCollections);

   useEffect(() => {
      setCollectionIds(urlCollections);
   }, [urlCollections]);

   const updateUrl = useDebouncedCallback((values: string[]) => {
      setUrlCollections(values);
   }, 400);

   const toggleCollection = (collectionId: string) => {
      const isSelected = includes(f_collectionIds, collectionId);
      const newCollectionIds = isSelected
         ? filter(f_collectionIds, (id) => id !== collectionId)
         : [...f_collectionIds, collectionId];

      setCollectionIds(newCollectionIds);
      updateUrl(newCollectionIds);
   };

   const { data: collections = [] } = useLoadCollections();

   const badge = () => {
      if (!isEmpty(f_collectionIds)) {
         return (
            <Badge variant="secondary" className="h-5 px-2 text-xs">
               {f_collectionIds.length}
            </Badge>
         );
      }
   };

   const renderCollection = (collection: DCollection) => {
      const isSelected = includes(f_collectionIds, collection.id);
      return (
         <div key={collection.id} className="flex items-center space-x-2">
            <Checkbox
               id={`collection-${collection.id}`}
               checked={isSelected}
               onCheckedChange={() => toggleCollection(collection.id)}
               data-testid={`collection-${collection.id}`}
            />
            <Label
               htmlFor={`collection-${collection.id}`}
               className="flex cursor-pointer items-center gap-1.5 text-sm font-normal"
            >
               <Folder
                  className="h-3.5 w-3.5 shrink-0"
                  style={{ color: collection.color }}
               />
               {collection.name}
            </Label>
         </div>
      );
   };

   if (isEmpty(collections)) {
      return (
         <div
            className="text-sm text-slate-500"
            data-testid="collections-empty"
         >
            Keine Sammlungen vorhanden
         </div>
      );
   }

   return (
      <div className="space-y-3" data-testid="collections-filter">
         <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Sammlungen</Label>
            {badge()}
         </div>
         <div className="max-h-50 space-y-2 overflow-y-auto">
            {collections.map(renderCollection)}
         </div>
      </div>
   );
};
