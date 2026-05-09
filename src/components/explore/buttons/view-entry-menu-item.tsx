"use client";

import { Eye } from "lucide-react";
import Link from "next/link";

import { DropdownMenuItem } from "@/components/shadcn/dropdown-menu";

type Props = {
   slug: string;
};

export const ViewCatalogEntryMenuItem = ({ slug }: Props) => {
   return (
      <DropdownMenuItem asChild={true}>
         <Link
            href={`/explore/${slug}`}
            className="flex cursor-pointer items-center gap-2"
            data-testid="view-entry-menu-item"
         >
            <Eye className="h-4 w-4" />
            Ansehen
         </Link>
      </DropdownMenuItem>
   );
};
