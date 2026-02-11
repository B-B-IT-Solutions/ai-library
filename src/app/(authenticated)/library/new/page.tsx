import { Metadata } from "next";

import { CreateTemplateForm } from "@/components/library/create-template";

export const metadata: Metadata = {
   title: "Neue Vorlage erstellen",
};

const CreateTemplatePage = async () => {
   return (
      <div
         className="h-screen flex flex-col bg-slate-50"
         data-testid="create-template-page"
      >
         {/* Top Navigation Bar */}
         <div className="bg-white border-b border-slate-200 px-6 py-4">
            <div className="flex items-center justify-between">
               <div>
                  <h1 className="text-2xl font-bold text-slate-900">
                     Neue Vorlage erstellen
                  </h1>
                  <p className="text-sm text-slate-600 mt-0.5">
                     Erstellen Sie eine eigene Prompt-Vorlage mit
                     benutzerdefinierten Feldern
                  </p>
               </div>
            </div>
         </div>

         {/* Main Content Area */}
         <div className="flex-1 overflow-y-auto bg-slate-50">
            <div className="max-w-5xl mx-auto p-8">
               <CreateTemplateForm />
            </div>
         </div>
      </div>
   );
};

export default CreateTemplatePage;
