"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { DeleteDropdownMenuItem } from "@/components/shared/dropdowns";
import { deleteTemplateDescriptor } from "@/data/actions/prompt";
import { DPrompt } from "@/data/types/domain/prompt";

type Props = {
   descriptor: DPrompt;
};

export const DeleteTemplateButton = ({ descriptor }: Props) => {
   const router = useRouter();

   const handleDelete = async () => {
      const result = await deleteTemplateDescriptor(descriptor.id);
      if (result.success) {
         toast.success(result.message);
         router.push("/templates");
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
         data-testid="delete-template-menu-item"
      />
   );
};
