"use client";

import { FC } from "react";
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
import { DLibraryCollectionUpdate } from "@/data/types/domain/library";
import { updateLibraryCollectionSchema } from "@/data/types/validators/library";
import { initLibraryCollection } from "../utils/initValues";

type Props = {
   open: boolean;
   onOpenChange: (open: boolean) => void;
};

export const CreateCollectionDialog: FC<Props> = ({ open, onOpenChange }) => {
   const { mutate: createCollection, isPending } = useCreateCollection();

   const form = useForm<DLibraryCollectionUpdate>({
      resolver: zodResolver(updateLibraryCollectionSchema),
      defaultValues: initLibraryCollection(),
   });

   const onSubmit = (data: DLibraryCollectionUpdate) => {
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
                  <FormInput<DLibraryCollectionUpdate>
                     name="name"
                     label="Name"
                     required={true}
                     placeholder="Meine Sammlung"
                     control={form.control}
                  />
                  <FormTextArea<DLibraryCollectionUpdate>
                     name="description"
                     label="Beschreibung"
                     placeholder="Beschreiben Sie diese Sammlung..."
                     control={form.control}
                  />
                  <FormInput<DLibraryCollectionUpdate>
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
