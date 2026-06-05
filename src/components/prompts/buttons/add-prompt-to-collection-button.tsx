import { FolderPlus } from "lucide-react";

import { DropdownMenuItem } from "@/components/shadcn/dropdown-menu";
import { CallbackFn } from "@/data/types/common";

type Props = {
   onClick: CallbackFn;
};

export const AddPromptToCollectionButton = ({ onClick }: Props) => {
   return (
      <DropdownMenuItem
         onClick={onClick}
         className="cursor-pointer hover:bg-accent"
         data-testid="add-to-collection-menu-item"
      >
         <FolderPlus className="mr-2 h-4 w-4" />
         Sammlungen
      </DropdownMenuItem>
   );
};
