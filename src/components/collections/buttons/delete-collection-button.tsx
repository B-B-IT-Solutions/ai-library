"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { DeleteDropdownMenuItem } from "@/components/shared/dropdowns";
import { deleteCollection } from "@/data/actions/collection";
import { DCollection } from "@/data/types/domain/collection";

type Props = {
   collection: DCollection;
};

export const DeleteCollectionButton = ({ collection }: Props) => {
   const router = useRouter();

   const handleDelete = async () => {
      const result = await deleteCollection(collection.id);
      if (result.success) {
         toast.success(result.message);
         router.push("/collections");
      } else {
         toast.error(result.message);
      }
   };

   return (
      <DeleteDropdownMenuItem
         label="Löschen"
         onDelete={handleDelete}
         dialog={{
            title: "Sammlung löschen?",
            description:
               "Diese Aktion kann nicht rückgängig gemacht werden. Die Sammlung wird dauerhaft gelöscht.",
         }}
         data-testid="delete-collection-menu-item"
      />
   );
};
