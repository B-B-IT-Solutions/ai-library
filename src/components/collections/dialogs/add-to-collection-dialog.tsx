"use client";

import { useEffect, useRef, useState } from "react";
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
import { useLoadCollectionPreviews } from "@/data/ts-queries/collection";
import {
   useLoadPromptCollectionIds,
   useUpdatePromptCollections,
} from "@/data/ts-queries/library";
import { UpdateCollectionIdsParams } from "@/data/ts-queries/library/types";
import { DCollectionPreview } from "@/data/types/domain/collection";
import { DPrompt } from "@/data/types/domain/prompt";

import { CollectionCreateDialog } from "./create-collection-dialog";

type Props = {
   prompt: DPrompt;
   open: boolean;
   onOpenChange: (open: boolean) => void;
};

export const AddToCollectionDialog = ({
   prompt,
   open,
   onOpenChange,
}: Props) => {
   const { mutate: updateCollections, isPending: isSaving } =
      useUpdatePromptCollections();
   const [showCreateDialog, setShowCreateDialog] = useState(false);
   const initializedRef = useRef(false);

   const [selectedColIds, setSelectedColdIds] = useState<string[]>([]);

   const { data: collections = [] } = useLoadCollectionPreviews({
      enabled: open,
   });

   const { data: promptCollectionIds, isLoading } = useLoadPromptCollectionIds({
      entryId: prompt.id,
      enabled: open,
   });

   useEffect(() => {
      if (promptCollectionIds && !initializedRef.current) {
         setSelectedColdIds(promptCollectionIds);
         initializedRef.current = true;
      }
   }, [promptCollectionIds]);

   const handleToggle = (colId: string) => {
      const isSelected = includes(selectedColIds, colId);
      const newColdIds = isSelected
         ? filter(selectedColIds, (id) => id !== colId)
         : [...selectedColIds, colId];

      setSelectedColdIds(newColdIds);
   };

   const handleConfirm = async () => {
      const params: UpdateCollectionIdsParams = {
         promptId: prompt.id,
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
      collection: DCollectionPreview,
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
                     color: collection.color,
                  }}
               />
               <span className="font-medium">{collection.name}</span>
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

               <div className="max-h-100 space-y-2 overflow-y-auto py-4">
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

         <CollectionCreateDialog
            open={showCreateDialog}
            onOpenChange={setShowCreateDialog}
         />
      </>
   );
};
