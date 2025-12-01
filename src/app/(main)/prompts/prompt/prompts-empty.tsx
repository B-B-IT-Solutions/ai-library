import { FC } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";

export const PromptsEmpty: FC = () => {
   return (
      <div
         className="bg-white rounded-lg p-12 border border-slate-200 shadow-sm text-center"
         data-testid="prompts-empty"
      >
         <div className="text-slate-500 mb-4">
            <Plus className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
               No Prompt Selected
            </h3>
            <p>Select a prompt from the list or create a new one</p>
         </div>
         <Button
            asChild={true}
            className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm"
         >
            <Link href="/prompts/new" data-testid="create-prompt-btn">
               <Plus className="w-4 h-4" /> Create Prompt
            </Link>
         </Button>
      </div>
   );
};
