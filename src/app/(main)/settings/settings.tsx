import { DPrompt } from "@/data/domain/prompt";

export const Settings = () => {
   const prompts: DPrompt[] = [];
   const favorites: DPrompt[] = [];
   const categories: string[] = [];

   return (
      <div data-testid="settings">
         <header className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Settings</h2>
            <p className="text-slate-600">
               Configure your prompt manager preferences
            </p>
         </header>

         <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm max-w-2xl">
            <div className="space-y-6">
               <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                     Data Management
                  </h3>
                  <div className="space-y-3">
                     <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <div>
                           <p className="font-medium text-slate-900">
                              Total Prompts
                           </p>
                           <p className="text-sm text-slate-600">
                              {prompts.length} prompts stored
                           </p>
                        </div>
                     </div>
                     <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <div>
                           <p className="font-medium text-slate-900">
                              Categories
                           </p>
                           <p className="text-sm text-slate-600">
                              {categories.length} categories
                           </p>
                        </div>
                     </div>
                     <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <div>
                           <p className="font-medium text-slate-900">
                              Favorites
                           </p>
                           <p className="text-sm text-slate-600">
                              {favorites.length} favorite prompts
                           </p>
                        </div>
                     </div>
                  </div>
               </div>

               <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                     About
                  </h3>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                     <p className="text-sm text-slate-600 mb-2">
                        Prompt Manager helps you organize, version, and manage
                        your AI prompts efficiently.
                     </p>
                     <p className="text-sm text-slate-600">Version 1.0.0</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};
