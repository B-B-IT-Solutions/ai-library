"use client";

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
import { useCreateCollection } from "@/data/ts-queries/library";
import { DCollectionUpdate } from "@/data/types/domain/collection";
import { updateCollectionSchema } from "@/data/types/validators/collection";
import { initCollection } from "../detail/edit/utils";

type Props = {
   open: boolean;
   onOpenChange: (open: boolean) => void;
};

export const CollectionCreateDialog = ({ open, onOpenChange }: Props) => {
   const { mutate: createCollection, isPending } = useCreateCollection();

   const form = useForm<DCollectionUpdate>({
      resolver: zodResolver(updateCollectionSchema),
      defaultValues: initCollection(),
   });

   const onSubmit = (data: DCollectionUpdate) => {
      createCollection(data, {
         onSuccess: (result) => {
            if (result.success) {
               toast.success(result.message);
               onOpenChange(false);
               form.reset();
            } else {
               toast.error(result.message);
            }
         },
         onError: () => {
            toast.error("Fehler beim Erstellen der Sammlung");
         },
      });
   };

   const submitBtnLabel = () => {
      if (isPending) {
         return (
            <>
               <Loader className="mr-1.5 h-4 w-4 animate-spin" />
               <span>Erstelle...</span>
            </>
         );
      }
      return "Erstellen";
   };

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent data-testid="create-library-collection-dialog">
            <DialogHeader>
               <DialogTitle>Neue Sammlung erstellen</DialogTitle>
               <DialogDescription>
                  Erstellen Sie eine neue Sammlung, um Ihre Vorlagen zu
                  organisieren.
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
                        data-testid="cancel-btn"
                     >
                        Abbrechen
                     </Button>
                     <Button
                        type="submit"
                        disabled={isPending}
                        data-testid="submit-btn"
                     >
                        {submitBtnLabel()}
                     </Button>
                  </DialogFooter>
               </form>
            </Form>
         </DialogContent>
      </Dialog>
   );
};
