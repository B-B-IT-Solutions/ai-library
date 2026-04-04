"use client";

import { FC, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/shadcn/button";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from "@/components/shadcn/dialog";
import { Form } from "@/components/shadcn/form";
import { FormInput, FormTextArea } from "@/components/shared/widgets";
import { useUpdateCollection } from "@/data/ts-queries/library";
import { DCollection, DCollectionUpdate } from "@/data/types/domain/collection";
import { updateLibraryCollectionSchema } from "@/data/types/validators/library";

type Props = {
   collection: DCollection;
   open: boolean;
   onOpenChange: (open: boolean) => void;
};

export const EditCollectionDialog: FC<Props> = ({
   collection,
   open,
   onOpenChange,
}) => {
   const { mutate: updateCollection, isPending } = useUpdateCollection();

   const form = useForm<DCollectionUpdate>({
      resolver: zodResolver(updateLibraryCollectionSchema),
      defaultValues: {
         name: collection.name,
         description: collection.description ?? "",
         color: collection.color ?? "#3b82f6",
         order: collection.order,
      },
   });

   useEffect(() => {
      if (open) {
         form.reset({
            name: collection.name,
            description: collection.description ?? "",
            color: collection.color ?? "#3b82f6",
            order: collection.order,
         });
      }
   }, [open, collection, form]);

   const onSubmit = (data: DCollectionUpdate) => {
      updateCollection(
         { collectionId: collection.id, data },
         {
            onSuccess: (result) => {
               if (result.success) {
                  toast.success(result.message);
                  onOpenChange(false);
               } else {
                  toast.error(result.message);
               }
            },
            onError: () => {
               toast.error("Fehler beim Aktualisieren der Sammlung");
            },
         }
      );
   };

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent data-testid="edit-collection-dialog">
            <DialogHeader>
               <DialogTitle>Sammlung bearbeiten</DialogTitle>
               <DialogDescription>
                  Ändern Sie Name, Beschreibung oder Farbe der Sammlung.
               </DialogDescription>
            </DialogHeader>
            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
               >
                  <FormInput<DCollectionUpdate>
                     name="name"
                     label="Name"
                     required={true}
                     placeholder="Meine Sammlung"
                     control={form.control}
                  />
                  <FormTextArea<DCollectionUpdate>
                     name="description"
                     label="Beschreibung"
                     placeholder="Beschreiben Sie diese Sammlung..."
                     control={form.control}
                  />
                  <FormInput<DCollectionUpdate>
                     name="color"
                     label="Farbe"
                     type="color"
                     control={form.control}
                  />
                  <DialogFooter>
                     <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                     >
                        Abbrechen
                     </Button>
                     <Button type="submit" disabled={isPending}>
                        {isPending ? (
                           <>
                              <Loader className="mr-1.5 h-4 w-4 animate-spin" />
                              Speichern...
                           </>
                        ) : (
                           "Speichern"
                        )}
                     </Button>
                  </DialogFooter>
               </form>
            </Form>
         </DialogContent>
      </Dialog>
   );
};
