import { FC } from "react";
import { FileText, Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";

export const EmptyPromptListItems: FC = () => {
   return (
      <div
         className="flex-1 flex items-center justify-center p-8"
         data-testid="prompt-list-items-empty"
      >
         <div className="text-center max-w-md">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
               <FileText className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">
               Keine Prompts gefunden
            </h3>
            <p className="text-sm text-slate-500 mb-6">
               Beginnen Sie, indem Sie Ihren ersten Prompt erstellen.
            </p>
            <Button
               asChild={true}
               className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg transition-all duration-200"
            >
               <Link href="/prompts/new" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  <span>Prompt erstellen</span>
               </Link>
            </Button>
         </div>
      </div>
   );
};
