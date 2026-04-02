"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { DeleteDropdownMenuItem } from "@/components/shared/dropdowns";
import { deleteTemplateDescriptor } from "@/data/actions/prompt-template";
import { DPromptTemplateDescriptorWithTemplate } from "@/data/types/domain/prompt.template";

type Props = {
   descriptor: DPromptTemplateDescriptorWithTemplate;
};

export const DeleteLibraryEntryButton = ({ descriptor }: Props) => {
   const router = useRouter();

   const handleDelete = async () => {
      const result = await deleteTemplateDescriptor(descriptor.id);
      if (result.success) {
         toast.success(result.message);
         router.push("/library");
      } else {
         toast.error(result.message);
      }
   };

   return (
      <DeleteDropdownMenuItem
         label="Löschen"
         onDelete={handleDelete}
         dialog={{
            title: "Vorlage löschen?",
            description:
               "Diese Aktion kann nicht rückgängig gemacht werden. Die Vorlage wird dauerhaft gelöscht.",
         }}
         data-testid="delete-entry-menu-item"
      />
   );
};
