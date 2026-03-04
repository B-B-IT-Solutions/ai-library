import { notFound } from "next/navigation";

import { PromptEdit } from "@/components/prompts";
import { getPrompt } from "@/data/actions/prompt";

export const metadata = {
   title: "Edit Prompt",
};

type PageParams = { id: string };

export type PageProps = {
   params: Promise<PageParams>;
};

const EditPromptPage = async (props: PageProps) => {
   const { id } = await props.params;

   const prompt = await getPrompt(id);

   if (!prompt) {
      return notFound();
   }

   return (
      <div
         className="flex h-screen flex-col bg-slate-50"
         data-testid="prompt-edit-page"
      >
         {/* Top Navigation Bar */}
         <div className="border-b border-slate-200 bg-white px-6 py-4">
            <div className="flex items-center justify-between">
               <div>
                  <h1 className="text-2xl font-bold text-slate-900">
                     Edit Prompt
                  </h1>
                  <p className="mt-0.5 text-sm text-slate-600">
                     Update your prompt. A new version will be created if you
                     modify the content.
                  </p>
               </div>
            </div>
         </div>

         {/* Main Content Area */}
         <div className="flex-1 overflow-y-auto bg-slate-50">
            <div className="mx-auto max-w-5xl p-8">
               <PromptEdit prompt={prompt} mode="edit" />
            </div>
         </div>
      </div>
   );
};

export default EditPromptPage;
