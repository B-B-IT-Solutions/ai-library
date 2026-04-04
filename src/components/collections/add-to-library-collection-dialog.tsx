"use client";

import { FC, useEffect, useRef, useState } from "react";
import { filter, includes, isEmpty, map } from "es-toolkit/compat";
import { Folder, Loader, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/shadcn/button";
import { Checkbox } from "@/components/shadcn/checkbox";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from "@/components/shadcn/dialog";
import { Label } from "@/components/shadcn/label";
import {
   useLoadEntryCollectionIds,
   useUpdateEntryCollections,
} from "@/data/ts-queries/library";
import { UpdateCollectionIdsParams } from "@/data/ts-queries/library/types";
import { DLibraryCollection } from "@/data/types/domain/collection";
import { DPromptTemplateDescriptor } from "@/data/types/domain/prompt.template";

import { LibraryCollectionCreateDialog } from "./create-library-collection-dialog";

type Props = {
   descriptor: DPromptTemplateDescriptor;
   collections: DLibraryCollection[];
   open: boolean;
   onOpenChange: (open: boolean) => void;
};

export const AddToLibraryCollectionDialog: FC<Props> = ({
   descriptor,
   collections,
   open,
   onOpenChange,
}) => {
   const { mutate: updateCollections, isPending: isSaving } =
      useUpdateEntryCollections();
   const [showCreateDialog, setShowCreateDialog] = useState(false);
   const initializedRef = useRef(false);

   const [selectedColIds, setSelectedColdIds] = useState<string[]>([]);

   const { data: entryCollectionIds, isLoading } = useLoadEntryCollectionIds({
      entryId: descriptor.id,
      enabled: open,
   });

   useEffect(() => {
      if (entryCollectionIds && !initializedRef.current) {
         setSelectedColdIds(entryCollectionIds);
         initializedRef.current = true;
      }
   }, [entryCollectionIds]);

   const handleToggle = (colId: string) => {
      const isSelected = includes(selectedColIds, colId);
      const newColdIds = isSelected
         ? filter(selectedColIds, (id) => id !== colId)
         : [...selectedColIds, colId];

      setSelectedColdIds(newColdIds);
   };

   const handleConfirm = async () => {
      const params: UpdateCollectionIdsParams = {
         entryId: descriptor.id,
         collectionIds: selectedColIds,
      };

      updateCollections(params, {
         onSuccess: (result) => {
            if (result.success) {
               toast.success(result.message);
               onOpenChange(false);
            } else {
               toast.error(result.message);
            }
         },
         onError: () => {
            toast.error("Fehler beim Aktualisieren der Sammlungen");
         },
      });
   };

   const renderCollectin = (
      collection: DLibraryCollection,
      isSelected: boolean
   ) => {
      return (
         <div
            key={collection.id}
            className="flex items-center space-x-3 rounded-lg p-3 transition-colors hover:bg-slate-50"
            data-testid="collection"
         >
            <Checkbox
               id={`collection-${collection.id}`}
               checked={isSelected}
               onCheckedChange={() => handleToggle(collection.id)}
               data-testid={`collection-${collection.id}`}
            />
            <Label
               htmlFor={`collection-${collection.id}`}
               className="flex flex-1 cursor-pointer items-center gap-2"
            >
               <Folder
                  className="h-4 w-4"
                  style={{
                     color: collection.color || "#64748b",
                  }}
               />
               <span className="font-medium">{collection.name}</span>
               {collection.description && (
                  <span className="truncate text-xs text-slate-500">
                     {collection.description}
                  </span>
               )}
            </Label>
         </div>
      );
   };

   const renderCollections = () => {
      if (isLoading) {
         return (
            <div
               className="flex items-center justify-center py-8"
               data-testid="collections-loading"
            >
               <Loader className="h-5 w-5 animate-spin text-slate-400" />
            </div>
         );
      }

      if (isEmpty(collections)) {
         return (
            <div className="py-8 text-center" data-testid="collections-empty">
               <p className="mb-4 text-sm text-slate-500">
                  Keine Sammlungen vorhanden
               </p>
               <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCreateDialog(true)}
                  className="gap-2"
                  data-testid="create-first-collection-btn"
               >
                  <Plus className="h-4 w-4" />
                  Erste Sammlung erstellen
               </Button>
            </div>
         );
      }

      return map(collections, (collection) => {
         const isSelected = includes(selectedColIds, collection.id);
         return renderCollectin(collection, isSelected);
      });
   };

   const saveBtnLabel = () => {
      if (isSaving) {
         return (
            <>
               <Loader className="mr-1.5 h-4 w-4 animate-spin" />
               <span>Speichern...</span>
            </>
         );
      }
      return "OK";
   };

   return (
      <>
         <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
               className="max-w-md"
               data-testid="add-to-collection-dialog"
            >
               <DialogHeader>
                  <DialogTitle>Zu Sammlung hinzufügen</DialogTitle>
                  <DialogDescription>
                     Wählen Sie die Sammlungen aus, zu denen diese Vorlage
                     hinzugefügt werden soll.
                  </DialogDescription>
               </DialogHeader>

               <div className="max-h-[400px] space-y-2 overflow-y-auto py-4">
                  {renderCollections()}
               </div>

               <DialogFooter className="flex justify-between border-t pt-4 sm:justify-between">
                  <Button
                     variant="outline"
                     size="sm"
                     onClick={() => setShowCreateDialog(true)}
                     className="gap-2"
                     data-testid="create-new-collection-btn"
                  >
                     <Plus className="h-4 w-4" />
                     Neue Sammlung
                  </Button>
                  <Button
                     size="sm"
                     disabled={isLoading || isSaving}
                     onClick={handleConfirm}
                     data-testid="save-btn"
                  >
                     {saveBtnLabel()}
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>

         <LibraryCollectionCreateDialog
            open={showCreateDialog}
            onOpenChange={setShowCreateDialog}
         />
      </>
   );
};
