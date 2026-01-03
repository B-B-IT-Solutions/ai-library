"use client";

import { FC, useTransition } from "react";
import { Loader, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/shadcn/button";
import { createPromptFromTemplate } from "@/data/actions/library/library.actions";

type CreatePromptButtonProps = {
   templateId: string;
};

export const CreatePromptButton: FC<CreatePromptButtonProps> = ({
   templateId,
}) => {
   const [isPending, startTransition] = useTransition();

   const handleCopyToPrompts = () => {
      startTransition(async () => {
         const result = await createPromptFromTemplate(templateId);
         if (result.success) {
            toast.success(result.message);
         } else {
            toast.error(result.message);
         }
      });
   };

   return (
      <Button
         variant="default"
         size="sm"
         onClick={handleCopyToPrompts}
         disabled={isPending}
         className="flex-1 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white"
         data-testid="create-prompt-button"
      >
         {isPending ? (
            <>
               <Loader className="w-4 h-4 mr-1.5 animate-spin" />
               Erstellen...
            </>
         ) : (
            <>
               <Plus className="w-4 h-4 mr-1.5" />
               Prompt erstellen
            </>
         )}
      </Button>
   );
};
