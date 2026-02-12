import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

import { CreateTemplateForm } from "@/components/library/create-template";
import { Button } from "@/components/shadcn/button";

export const metadata: Metadata = {
   title: "Neue Vorlage erstellen",
};

const CreateTemplatePage = async () => {
   return (
      <div
         className="flex h-screen flex-col bg-slate-50"
         data-testid="create-library-entry-page"
      >
         {/* Top Navigation Bar */}
         <div className="border-b border-slate-200 bg-white px-6 py-4">
            <div className="flex items-center justify-between">
               <div>
                  <h1 className="text-2xl font-bold text-slate-900">
                     Neue Vorlage erstellen
                  </h1>
                  <p className="mt-0.5 text-sm text-slate-600">
                     Erstellen Sie eine eigene Prompt-Vorlage mit
                     benutzerdefinierten Feldern
                  </p>
               </div>
            </div>
         </div>

         {/* Main Content Area */}
         <div className="flex-1 overflow-y-auto bg-slate-50">
            <div className="mx-auto max-w-5xl p-8">
               <div className="mb-6">
                  <Link href="/library">
                     <Button
                        variant="ghost"
                        size="sm"
                        className="cursor-pointer"
                     >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Zurück zur Bibliothek
                     </Button>
                  </Link>
               </div>
               <CreateTemplateForm />
            </div>
         </div>
      </div>
   );
};

export default CreateTemplatePage;
