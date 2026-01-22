import { PromptCreateEdit } from "@/components/prompts";

export const metadata = {
   title: "Create Prompt",
};

const CreatePromptPage = async () => {
   return (
      <div
         className="h-screen flex flex-col bg-slate-50"
         data-testid="create-prompt-page"
      >
         {/* Top Navigation Bar */}
         <div className="bg-white border-b border-slate-200 px-6 py-4">
            <div className="flex items-center justify-between">
               <div>
                  <h1 className="text-2xl font-bold text-slate-900">
                     Create Prompt
                  </h1>
                  <p className="text-sm text-slate-600 mt-0.5">
                     Add a new prompt to your library with version control
                  </p>
               </div>
            </div>
         </div>

         {/* Main Content Area */}
         <div className="flex-1 overflow-y-auto bg-slate-50">
            <div className="max-w-5xl mx-auto p-8">
               <PromptCreateEdit />
            </div>
         </div>
      </div>
   );
};

export default CreatePromptPage;
