"use client";

import { FC, useState } from "react";
import { Folder, Plus } from "lucide-react";
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
   useAddToCollection,
   useLoadLibraryCollections,
   useRemoveFromCollection,
} from "@/data/ts-queries/library";
import { CreateCollectionDialog } from "../sidebar/create-collection-dialog";

type AddToCollectionDialogProps = {
   entryId: string;
   currentCollections: string[];
   open: boolean;
   onOpenChange: (open: boolean) => void;
};

export const AddToCollectionDialog: FC<AddToCollectionDialogProps> = ({
   entryId,
   currentCollections,
   open,
   onOpenChange,
}) => {
   const { data: collections = [] } = useLoadLibraryCollections();
   const { mutate: addToCollection } = useAddToCollection();
   const { mutate: removeFromCollection } = useRemoveFromCollection();
   const [showCreateDialog, setShowCreateDialog] = useState(false);

   const [selectedCollections, setSelectedCollections] =
      useState<string[]>(currentCollections);

   const handleToggle = (collectionId: string) => {
      const isCurrentlyInCollection =
         selectedCollections.includes(collectionId);

      if (isCurrentlyInCollection) {
         // Remove from collection
         removeFromCollection(
            { collectionId, entryId },
            {
               onSuccess: (result) => {
                  if (result.success) {
                     setSelectedCollections((prev) =>
                        prev.filter((id) => id !== collectionId)
                     );
                     toast.success(result.message);
                  } else {
                     toast.error(result.message);
                  }
               },
               onError: () => {
                  toast.error("Fehler beim Entfernen aus der Sammlung");
               },
            }
         );
      } else {
         // Add to collection
         addToCollection(
            { collectionId, entryId },
            {
               onSuccess: (result) => {
                  if (result.success) {
                     setSelectedCollections((prev) => [...prev, collectionId]);
                     toast.success(result.message);
                  } else {
                     toast.error(result.message);
                  }
               },
               onError: () => {
                  toast.error("Fehler beim Hinzufügen zur Sammlung");
               },
            }
         );
      }
   };

   return (
      <>
         <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
               <DialogHeader>
                  <DialogTitle>Zu Sammlung hinzufügen</DialogTitle>
                  <DialogDescription>
                     Wählen Sie die Sammlungen aus, zu denen diese Vorlage
                     hinzugefügt werden soll.
                  </DialogDescription>
               </DialogHeader>

               <div className="max-h-[400px] space-y-2 overflow-y-auto py-4">
                  {collections.length === 0 ? (
                     <div className="py-8 text-center">
                        <p className="mb-4 text-sm text-slate-500">
                           Keine Sammlungen vorhanden
                        </p>
                        <Button
                           variant="outline"
                           size="sm"
                           onClick={() => setShowCreateDialog(true)}
                           className="gap-2"
                        >
                           <Plus className="h-4 w-4" />
                           Erste Sammlung erstellen
                        </Button>
                     </div>
                  ) : (
                     collections.map((collection) => {
                        const isSelected = selectedCollections.includes(
                           collection.id
                        );
                        return (
                           <div
                              key={collection.id}
                              className="flex items-center space-x-3 rounded-lg p-3 transition-colors hover:bg-slate-50"
                           >
                              <Checkbox
                                 id={`collection-${collection.id}`}
                                 checked={isSelected}
                                 onCheckedChange={() =>
                                    handleToggle(collection.id)
                                 }
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
                                 <span className="font-medium">
                                    {collection.name}
                                 </span>
                                 {collection.description && (
                                    <span className="truncate text-xs text-slate-500">
                                       {collection.description}
                                    </span>
                                 )}
                              </Label>
                           </div>
                        );
                     })
                  )}
               </div>

               {collections.length > 0 && (
                  <DialogFooter className="border-t pt-4">
                     <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowCreateDialog(true)}
                        className="gap-2"
                     >
                        <Plus className="h-4 w-4" />
                        Neue Sammlung
                     </Button>
                     <Button size="sm" onClick={() => onOpenChange(false)}>
                        Fertig
                     </Button>
                  </DialogFooter>
               )}
            </DialogContent>
         </Dialog>

         {/* Create Collection Dialog */}
         <CreateCollectionDialog
            open={showCreateDialog}
            onOpenChange={setShowCreateDialog}
         />
      </>
   );
};
