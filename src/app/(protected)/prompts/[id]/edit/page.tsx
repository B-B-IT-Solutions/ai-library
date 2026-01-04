import { notFound } from "next/navigation";

import { PromptFormEdit } from "@/components/prompts/prompt";
import { getPrompt } from "@/data/actions/prompt";

export const metadata = {
   title: "Edit Prompt",
};

type PageParams = { id: string };

export type EditPromptPageProps = {
   params: Promise<PageParams>;
};

const EditPromptPage = async (props: EditPromptPageProps) => {
   const { id } = await props.params;

   const prompt = await getPrompt(id);

   if (!prompt) {
      return notFound();
   }

   return (
      <div className="h-screen flex flex-col bg-slate-50" data-testid="edit-prompt-page">
         {/* Top Navigation Bar */}
         <div className="bg-white border-b border-slate-200 px-6 py-4">
            <div className="flex items-center justify-between">
               <div>
                  <h1 className="text-2xl font-bold text-slate-900">Edit Prompt</h1>
                  <p className="text-sm text-slate-600 mt-0.5">
                     Update your prompt. A new version will be created if you modify the content.
                  </p>
               </div>
            </div>
         </div>

         {/* Main Content Area */}
         <div className="flex-1 overflow-y-auto bg-slate-50">
            <div className="max-w-5xl mx-auto p-8">
               <PromptFormEdit prompt={prompt} mode="edit" />
            </div>
         </div>
      </div>
   );
};

export default EditPromptPage;
