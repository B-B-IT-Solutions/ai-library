import { Edit2 } from "lucide-react";
import Link from "next/link";

import { DropdownMenuItem } from "@/components/shadcn/dropdown-menu";
import { DCollection } from "@/data/types/domain/collection";

type Props = {
   collection: DCollection;
};

export const EditCollectionButton = ({ collection }: Props) => {
   return (
      <DropdownMenuItem
         asChild={true}
         className="cursor-pointer hover:bg-accent"
         data-testid="edit-collection-menu-item"
      >
         <Link href={`/collections/${collection.id}/edit`}>
            <Edit2 className="h-4 w-4" />
            Bearbeiten
         </Link>
      </DropdownMenuItem>
   );
};
