"use client";

import { CopyButton } from "@/components/shared/buttons";
import { DCollection } from "@/data/types/domain/collection";
import { cn } from "@/lib/utils";

type Props = {
   collection: DCollection;
   className?: string;
};

export const CopyCollectionUrlButton = ({ collection, className }: Props) => {
   const publicUrl = `${window.location.origin}/preview/collections/${collection.publicToken}`;

   return (
      <CopyButton
         content={publicUrl}
         type="button"
         variant="outline"
         size="icon-sm"
         className={cn("shrink-0", className)}
         data-testid="copy-collection-url-btn"
      />
   );
};
