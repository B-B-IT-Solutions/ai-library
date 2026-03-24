"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { DeleteDropdownMenuItem } from "@/components/shared/dropdowns";
import { deleteLibraryEntry } from "@/data/actions/library";
import { DLibraryEntry } from "@/data/types/domain/library";

type Props = {
   entry: DLibraryEntry;
};

export const DeleteLibraryEntryButton = ({ entry }: Props) => {
   const router = useRouter();

   const handleDelete = async () => {
      const result = await deleteLibraryEntry(entry.id);
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
