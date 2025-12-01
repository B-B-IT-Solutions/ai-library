import {
   dehydrate,
   HydrationBoundary,
   QueryClient,
} from "@tanstack/react-query";

import {
   preloadPromptCategoriesOptions,
   preloadPromptsOptions,
   preloadPromptTemplateCategoriesOptions,
   preloadPromptTemplatesOptions,
} from "@/data/ts-queries/prompt";

import { PromptsList } from "./prompt/prompts-list";
import { PromptManager } from "./prompt-manager";

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
      <div
         className="h-full w-full text-slate-900 flex flex-col"
         data-testid="prompts-page"
      >
         <div className="flex-1">
            <header className="mb-8">
               <h2 className="text-3xl font-bold text-slate-900 mb-2">
                  All Prompts
               </h2>
               <p className="text-slate-600">
                  Create, version, and organize your AI prompts
               </p>
            </header>
            <HydrationBoundary state={dehydrate(queryClient)}>
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1">
                     <PromptsList />
                  </div>
                  <div className="lg:col-span-2">
                     <PromptManager />
                  </div>
               </div>
            </HydrationBoundary>
         </div>
      </div>
   );
};

export default PromptsPage;
