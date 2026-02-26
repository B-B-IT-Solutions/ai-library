import { Edit2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";
import { DLibraryEntry } from "@/data/types/domain/library";

type Props = {
   entry: DLibraryEntry;
};

export const EditLibraryEntryButton = ({ entry }: Props) => {
   return (
      <Button
         asChild={true}
         variant="outline"
         size="sm"
         data-testid="edit-entry-btn"
      >
         <Link href={`/library/${entry.id}/edit`}>
            <Edit2 className="h-4 w-4" />
            Bearbeiten
         </Link>
      </Button>
   );
};
