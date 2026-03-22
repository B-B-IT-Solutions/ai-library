"use client";

import { DPromptDescriptor } from "@/data/types/domain/prompt";

import { PromptEditForm } from "./prompt-edit-form";

type Props = {
   prompt?: DPromptDescriptor;
};

export const PromptEdit = ({ prompt }: Props) => {
   const header = () => {
      if (prompt) {
         return (
            <div>
               <h1 className="text-2xl font-bold text-slate-900">
                  Prompt bearbeiten
               </h1>
               <p className="mt-0.5 text-sm text-slate-600">{prompt.title}</p>
            </div>
         );
      }

      return (
         <div>
            <h1 className="text-2xl font-bold text-slate-900">
               Neuer Prompt erstellen
            </h1>
            <p className="mt-0.5 text-sm text-slate-600">
               Erstellen Sie einen neuen Prompt
            </p>
         </div>
      );
   };

   return (
      <div
         className="flex h-screen flex-col bg-slate-50"
         data-testid="prompt-edit"
      >
         <div className="border-b border-slate-200 bg-white px-6 py-4">
            <div className="flex items-center justify-between">{header()}</div>
         </div>
         <div className="flex-1 overflow-y-auto bg-slate-50">
            <div className="mx-auto max-w-5xl p-4">
               <PromptEditForm
                  prompt={prompt}
                  mode={prompt ? "edit" : "create"}
               />
            </div>
         </div>
      </div>
   );
};
