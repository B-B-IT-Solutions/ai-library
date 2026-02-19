"use client";

import { FC, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
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
   DialogTrigger,
} from "@/components/shadcn/dialog";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/shadcn/form";
import { Input } from "@/components/shadcn/input";
import { Textarea } from "@/components/shadcn/textarea";
import { useCreateCollection } from "@/data/ts-queries/library";
import { DLibraryCollectionUpdate } from "@/data/types/domain/library";
import { updateLibraryCollectionSchema } from "@/data/types/validators/library";
import { initLibraryCollection } from "../utils/initValues";

type Props = {
   controlledOpen?: boolean;
   onOpenChange?: (open: boolean) => void;
};

export const CreateCollectionDialog: FC<Props> = ({
   controlledOpen,
   onOpenChange,
}) => {
   const [internalOpen, setInternalOpen] = useState(false);
   const { mutate: createCollection, isPending } = useCreateCollection();

   const open = controlledOpen ?? internalOpen;
   const setOpen = onOpenChange ?? setInternalOpen;

   const form = useForm<DLibraryCollectionUpdate>({
      resolver: zodResolver(updateLibraryCollectionSchema),
      defaultValues: initLibraryCollection(),
   });

   const onSubmit = (data: DLibraryCollectionUpdate) => {
      createCollection(data, {
         onSuccess: (result) => {
            if (result.success) {
               toast.success(result.message);
               setOpen(false);
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

   const renderForm = () => {
      return (
         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
               <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Name *</FormLabel>
                        <FormControl>
                           <Input placeholder="Meine Sammlung" {...field} />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Beschreibung</FormLabel>
                        <FormControl>
                           <Textarea
                              placeholder="Beschreiben Sie diese Sammlung..."
                              {...field}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Farbe</FormLabel>
                        <FormControl>
                           <Input type="color" {...field} />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <DialogFooter>
                  <Button
                     type="button"
                     variant="outline"
                     onClick={() => setOpen(false)}
                  >
                     Abbrechen
                  </Button>
                  <Button type="submit" disabled={isPending}>
                     {isPending ? "Erstelle..." : "Erstellen"}
                  </Button>
               </DialogFooter>
            </form>
         </Form>
      );
   };

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         {!controlledOpen && (
            <DialogTrigger asChild>
               <Button variant="outline" size="sm" className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Neue Sammlung
               </Button>
            </DialogTrigger>
         )}
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Neue Sammlung erstellen</DialogTitle>
               <DialogDescription>
                  Erstellen Sie eine neue Sammlung, um Ihre Vorlagen zu
                  organisieren.
               </DialogDescription>
            </DialogHeader>
            {renderForm()}
         </DialogContent>
      </Dialog>
   );
};
