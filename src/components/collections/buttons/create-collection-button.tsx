import { Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";

type Props = {
   size?: "default" | "sm";
};

export const CreateCollectionButton = ({ size = "default" }: Props) => {
   return (
      <Button
         asChild={true}
         size={size}
         className="cursor-pointer gap-2"
         data-testid="create-collection-btn"
      >
         <Link href="/collections/new">
            <Plus className="h-4 w-4" />
            Neue Sammlung
         </Link>
      </Button>
   );
};
