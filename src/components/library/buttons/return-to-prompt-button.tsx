import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";

type Props = {
   entryId: string;
};

export const ReturnToPromptButton = ({ entryId }: Props) => {
   return (
      <Button
         asChild={true}
         variant="ghost"
         size="sm"
         className="cursor-pointer"
         data-testid="return-to-prompt-btn"
      >
         <Link href={`/library/${entryId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zurück zur Vorlage
         </Link>
      </Button>
   );
};
