import { FC } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";

export const PromptsEmpty: FC = () => {
   return (
      <div
         className="bg-white rounded-xl p-16 border border-slate-200 shadow-sm text-center w-full"
         data-testid="prompts-empty"
      >
         <div className="text-slate-500">
            <Plus className="w-20 h-20 mx-auto mb-6 opacity-40 text-slate-400" />
            <h3 className="text-2xl font-semibold text-slate-900 mb-3">
               No Prompt Selected
            </h3>
            <p className="text-slate-600 mb-8">
               Select a prompt from the library or create a new one to get
               started
            </p>
         </div>
         <Button
            asChild={true}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
         >
            <Link
               href="/prompts/new"
               className="flex items-center gap-2"
               data-testid="create-prompt-btn"
            >
               <Plus className="w-5 h-5" />
               Create Prompt
            </Link>
         </Button>
      </div>
   );
};
