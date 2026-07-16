"use client";

import { useEffect, useMemo, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
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
import { FormInput } from "@/components/shared/widgets";
import { updatePromptModel } from "@/data/actions/prompt";
import {
   DPromptModelUpdate,
   DPromptModelWithUsage,
} from "@/data/types/domain/prompt";
import { initPromptModel } from "../utils";

import { updateModelSchemaBackendValidation } from "./update-model.schema";

type Props = {
   open: boolean;
   onClose: () => void;
   model: DPromptModelWithUsage;
};

export const UpdateModelDialog = ({ open, onClose, model }: Props) => {
   const router = useRouter();
   const [isPending, startTransition] = useTransition();

   const updateSchema = useMemo(
      () => updateModelSchemaBackendValidation(model.id),
      [model.id]
   );

   const form = useForm<DPromptModelUpdate>({
      resolver: zodResolver(updateSchema),
      defaultValues: initPromptModel(model),
   });

   useEffect(() => {
      if (open) {
         form.reset(initPromptModel(model));
      }
   }, [open, model, form]);

   const onSubmit: SubmitHandler<DPromptModelUpdate> = async (data) => {
      startTransition(async () => {
         const result = await updatePromptModel(model.id, data);
         if (result.success) {
            toast.success(result.message);
            router.refresh();
            onClose();
         } else {
            toast.error(result.message);
         }
      });
   };

   const confirmBtnLabel = () => {
      if (isPending) {
         return (
            <>
               <Loader className="h-4 w-4" />
               Wird gespeichert
            </>
         );
      }
      return "Speichern";
   };

   return (
      <Dialog open={open} onOpenChange={onClose}>
         <DialogContent data-testid="update-model-dialog">
            <DialogHeader>
               <DialogTitle>Modell umbenennen</DialogTitle>
               <DialogDescription>
                  Benenne das Modell <strong>{model.name}</strong> um. Die
                  Änderung wirkt sich auf alle Prompts aus, denen dieses
                  Modell zugewiesen ist.
               </DialogDescription>
            </DialogHeader>
            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
               >
                  <FormInput<DPromptModelUpdate>
                     name="name"
                     label="Name"
                     placeholder="Modell-Name"
                     control={form.control}
                  />
                  <DialogFooter>
                     <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isPending}
                        className="cursor-pointer"
                        data-testid="cancel-btn"
                     >
                        Abbrechen
                     </Button>
                     <Button
                        type="submit"
                        disabled={isPending}
                        className="cursor-pointer"
                        data-testid="submit-btn"
                     >
                        {confirmBtnLabel()}
                     </Button>
                  </DialogFooter>
               </form>
            </Form>
         </DialogContent>
      </Dialog>
   );
};
