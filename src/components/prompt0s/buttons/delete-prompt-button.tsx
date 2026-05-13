"use client";

import { FC } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { DeleteDropdownMenuItem } from "@/components/shared/dropdowns";
import { deletePrompt } from "@/data/actions/prompt0";
import { DPrompt0 } from "@/data/types/domain/prompt0";

type DeletePromptButtonProps = {
   prompt: DPrompt0;
};

export const DeletePromptButton: FC<DeletePromptButtonProps> = ({ prompt }) => {
   const router = useRouter();

   const handleDelete = async () => {
      const result = await deletePrompt(prompt.id);
      if (result.success) {
         toast.success(result.message);
         router.push("/prompts");
      } else {
         toast.error(result.message);
      }
   };

   return (
      <DeleteDropdownMenuItem
         label="Löschen"
         onDelete={handleDelete}
         dialog={{
            title: "Prompt löschen?",
            description:
               "Diese Aktion kann nicht rückgängig gemacht werden. Alle Versionen und Folge-Prompts werden ebenfalls gelöscht.",
         }}
         data-testid="delete-prompt-btn"
      />
   );
};
