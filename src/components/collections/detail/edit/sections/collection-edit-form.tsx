"use client";

import { useEffect, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Form } from "@/components/shadcn/form";
import { FormInput, FormTextArea } from "@/components/shared/widgets";
import { createCollection, updateCollection } from "@/data/actions/collection";
import { DCollection, DCollectionUpdate } from "@/data/types/domain/collection";
import { updateCollectionSchema } from "@/data/types/validators/collection";
import { initCollection } from "../utils";

type Props = {
   collection?: DCollection;
   onSubmittingChange?: (isSubmitting: boolean) => void;
};

export const CollectionEditForm = ({ collection, onSubmittingChange }: Props) => {
   const router = useRouter();
   const isEdit = !!collection;

   const [isSubmitting, startTransition] = useTransition();

   useEffect(() => {
      onSubmittingChange?.(isSubmitting);
   }, [isSubmitting, onSubmittingChange]);

   const form = useForm<DCollectionUpdate>({
      resolver: zodResolver(updateCollectionSchema),
      defaultValues: initCollection(collection),
   });

   const onCreateCollection = async (data: DCollectionUpdate) => {
      startTransition(async () => {
         const result = await createCollection(data);
         if (result.success && result.data) {
            toast.success(result.message);
            router.push(`/collections/${result.data.id}`);
         } else {
            toast.error(result.message);
         }
      });
   };

   const onUpdateCollection = (data: DCollectionUpdate) => {
      startTransition(async () => {
         const result = await updateCollection(collection!.id, data);
         if (result.success) {
            toast.success(result.message);
         } else {
            toast.error(result.message);
         }
         router.refresh();
      });
   };

   const onSubmit: SubmitHandler<DCollectionUpdate> = (data) => {
      if (isEdit) {
         onUpdateCollection(data);
      } else {
         onCreateCollection(data);
      }
   };

   return (
      <div className="rounded-xl bg-white p-6 shadow-sm" data-testid="collection-edit-form">
         <Form {...form}>
            <form
               id="collection-edit-form"
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
            </form>
         </Form>
      </div>
   );
};
