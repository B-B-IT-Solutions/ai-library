"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/shadcn/button";
import { Form } from "@/components/shadcn/form";
import { FormInput, FormTextArea } from "@/components/shared/widgets";
import { useCreateCollection } from "@/data/ts-queries/library";
import { DCollectionUpdate } from "@/data/types/domain/collection";
import { updateCollectionSchema } from "@/data/types/validators/collection";

import { initCollection } from "./utils";

export const CreateCollectionForm = () => {
   const router = useRouter();
   const { mutate: createCollection, isPending } = useCreateCollection();

   const form = useForm<DCollectionUpdate>({
      resolver: zodResolver(updateCollectionSchema),
      defaultValues: initCollection(),
   });

   const onSubmit = (data: DCollectionUpdate) => {
      createCollection(data, {
         onSuccess: (result) => {
            if (result.success && result.data) {
               toast.success(result.message);
               router.push(`/collections/${result.data.id}/edit`);
            } else {
               toast.error(result.message);
            }
         },
         onError: () => {
            toast.error("Fehler beim Erstellen der Sammlung");
         },
      });
   };

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormInput<DCollectionUpdate>
               name="name"
               label="Name"
               required={true}
               placeholder="z.B. Marketing-Vorlagen"
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

            <div className="flex gap-3 pt-2">
               <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/collections")}
               >
                  Abbrechen
               </Button>
               <Button type="submit" disabled={isPending}>
                  {isPending ? (
                     <>
                        <Loader className="mr-1.5 h-4 w-4 animate-spin" />
                        Erstelle...
                     </>
                  ) : (
                     "Sammlung erstellen"
                  )}
               </Button>
            </div>
         </form>
      </Form>
   );
};
