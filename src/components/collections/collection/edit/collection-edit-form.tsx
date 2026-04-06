"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/shadcn/button";
import { Card, CardContent } from "@/components/shadcn/card";
import { Form } from "@/components/shadcn/form";
import { FormInput, FormTextArea } from "@/components/shared/widgets";
import {
   useCreateCollection,
   useUpdateCollection,
} from "@/data/ts-queries/library";
import { DCollection, DCollectionUpdate } from "@/data/types/domain/collection";
import { updateCollectionSchema } from "@/data/types/validators/collection";

import { initCollection } from "./utils";

type Props = {
   collection?: DCollection;
};

export const CollectionEditForm = ({ collection }: Props) => {
   const router = useRouter();
   const isEdit = !!collection;

   const { mutate: updateCollection, isPending: isUpdating } =
      useUpdateCollection();
   const { mutate: createCollection, isPending: isCreating } =
      useCreateCollection();

   const form = useForm<DCollectionUpdate>({
      resolver: zodResolver(updateCollectionSchema),
      defaultValues: initCollection(collection),
   });

   const isSubmitting = isUpdating || isCreating;

   const onSubmit = (data: DCollectionUpdate) => {
      if (isEdit) {
         updateCollection(
            { collectionId: collection.id, data },
            {
               onSuccess: (result) => {
                  if (result.success) {
                     toast.success(result.message);
                  } else {
                     toast.error(result.message);
                  }
               },
               onError: () => toast.error("Fehler beim Speichern"),
            }
         );
      } else {
         createCollection(data, {
            onSuccess: (result) => {
               if (result.success && result.data) {
                  toast.success(result.message);
                  // if (onCreated) {
                  //    onCreated(result.data.id);
                  // } else {
                  router.push(`/collections/${result.data.id}`);
                  // }
               } else {
                  toast.error(result.message);
               }
            },
            onError: () => {
               toast.error("Fehler beim Erstellen der Sammlung");
            },
         });
      }
   };

   const cancelBtn = () => {
      return (
         <Link href={isEdit ? `/collections/${collection.id}` : "/collections"}>
            <Button
               type="button"
               variant="outline"
               disabled={isSubmitting}
               className="cursor-pointer"
               data-testid="cancel-btn"
            >
               Abbrechen
            </Button>
         </Link>
      );
   };

   const submitBtn = () => {
      return (
         <Button
            type="submit"
            disabled={isSubmitting}
            className="cursor-pointer"
            data-testid={"save-btn"}
         >
            {isSubmitting ? (
               <>
                  <Loader className="h-4 w-4 animate-spin" />
                  {isEdit ? "Wird gespeichert..." : "Wird erstellt..."}
               </>
            ) : isEdit ? (
               "Speichern"
            ) : (
               "Erstellen"
            )}
         </Button>
      );
   };

   const buttons = () => {
      return (
         <div className="flex items-center justify-end gap-3 pt-2">
            {cancelBtn()}
            {submitBtn()}
         </div>
      );
   };

   return (
      <Card data-testid="collection-edit-form">
         <CardContent>
            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-5"
               >
                  <FormInput<DCollectionUpdate>
                     name="name"
                     label="Name"
                     required={true}
                     control={form.control}
                  />
                  <FormTextArea<DCollectionUpdate>
                     name="description"
                     label="Beschreibung"
                     placeholder="Wofür wird diese Sammlung verwendet?"
                     control={form.control}
                  />
                  <FormInput<DCollectionUpdate>
                     name="color"
                     label="Farbe"
                     type="color"
                     control={form.control}
                  />
                  {buttons()}
               </form>
            </Form>
         </CardContent>
      </Card>
   );
};
