import { FC } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";

export const CreatePromptButton: FC = () => {
   return (
      <Button
         asChild={true}
         size="sm"
         className="cursor-pointer gap-2"
         data-testid="create-prompt-btn"
      >
         <Link href="/prompts/new">
            <Plus className="h-4 w-4" />
            Neuer Prompt
         </Link>
      </Button>
   );
};
