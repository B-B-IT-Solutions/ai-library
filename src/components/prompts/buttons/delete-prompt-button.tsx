"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { DeleteButton } from "@/components/shared/buttons";
import { DeleteDropdownMenuItem } from "@/components/shared/dropdowns";
import { deletePrompt } from "@/data/actions/prompt";
import { DPrompt } from "@/data/types/domain/prompt";

type Props = {
   prompt: DPrompt;
   asMenuItem?: boolean;
};

export const DeletePromptButton = ({ prompt, asMenuItem }: Props) => {
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

   if (asMenuItem) {
      return (
         <DeleteDropdownMenuItem
            label="Löschen"
            onDelete={handleDelete}
            dialog={{
               title: "Prompt löschen?",
               description:
                  "Diese Aktion kann nicht rückgängig gemacht werden. Der Prompt wird dauerhaft gelöscht.",
            }}
            data-testid="delete-prompt-menu-item"
         />
      );
   }

   return (
      <DeleteButton
         label="Löschen"
         onDelete={handleDelete}
         dialog={{
            title: "Prompt löschen?",
            description:
               "Diese Aktion kann nicht rückgängig gemacht werden. Der Prompt wird dauerhaft gelöscht.",
         }}
         data-testid="delete-prompt-btn"
      />
   );
};
