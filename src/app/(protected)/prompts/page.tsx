import {
   dehydrate,
   HydrationBoundary,
   QueryClient,
} from "@tanstack/react-query";

import { PromptsList, PromptView } from "@/components/prompts/prompt";
import {
   preloadPromptCategoriesOptions,
   preloadPromptsOptions,
   preloadPromptTemplateCategoriesOptions,
   preloadPromptTemplatesOptions,
} from "@/data/ts-queries/prompt";

export const metadata = {
   title: "Prompts",
};

const PromptsPage = async () => {
   const queryClient = new QueryClient();
   await queryClient.prefetchQuery(preloadPromptsOptions());
   await queryClient.prefetchQuery(preloadPromptCategoriesOptions());
   await queryClient.prefetchQuery(preloadPromptTemplatesOptions());
   await queryClient.prefetchQuery(preloadPromptTemplateCategoriesOptions());

   return (
      <div className="h-screen flex flex-col bg-slate-50" data-testid="prompts-page">
         {/* Top Navigation Bar */}
         <div className="bg-white border-b border-slate-200 px-6 py-4">
            <div className="flex items-center justify-between">
               <div>
                  <h1 className="text-2xl font-bold text-slate-900">Prompts</h1>
                  <p className="text-sm text-slate-600 mt-0.5">
                     Manage your AI prompt library with version control
                  </p>
               </div>
            </div>
         </div>

         {/* Main Content Area */}
         <div className="flex-1 flex overflow-hidden">
            <HydrationBoundary state={dehydrate(queryClient)}>
               {/* Sidebar List */}
               <div className="w-96 bg-white border-r border-slate-200 flex flex-col">
                  <PromptsList />
               </div>

               {/* Main Content Panel */}
               <div className="flex-1 overflow-y-auto bg-slate-50">
                  <div className="max-w-5xl mx-auto p-8">
                     <PromptView />
                  </div>
               </div>
            </HydrationBoundary>
         </div>
      </div>
   );
};

export default PromptsPage;
