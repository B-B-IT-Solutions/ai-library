"use client";

import { FC, useTransition } from "react";
import { Loader, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/shadcn/button";
import { createPromptFromTemplate } from "@/data/actions/library";
import { DPromptTemplateDescriptor } from "@/data/types/domain/prompt.template";
import { cn } from "@/lib/utils";

type CreatePromptButtonProps = {
   descriptor: DPromptTemplateDescriptor;
   className?: string;
};

export const CreatePromptButton: FC<CreatePromptButtonProps> = ({
   descriptor,
   className,
}) => {
   const [isPending, startTransition] = useTransition();

   const handleCopyToPrompts = () => {
      startTransition(async () => {
         const result = await createPromptFromTemplate(descriptor.id);
         if (result.success) {
            toast.success(result.message);
         } else {
            toast.error(result.message);
         }
      });
   };

   const label = () => {
      if (isPending) {
         return (
            <>
               <Loader className="w-4 h-4 mr-1.5 animate-spin" />
               <span>Erstellen...</span>
            </>
         );
      }

      return (
         <>
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Prompt erstellen</span>
         </>
      );
   };

   return (
      <Button
         variant="default"
         size="sm"
         onClick={handleCopyToPrompts}
         disabled={isPending}
         className={cn(
            "cursor-pointer bg-blue-600 hover:bg-blue-700 text-white",
            className
         )}
         data-testid="create-prompt-btn"
      >
         {label()}
      </Button>
   );
};
