import {
   dehydrate,
   HydrationBoundary,
   QueryClient,
} from "@tanstack/react-query";

import { PromptsList } from "@/components/prompts";
import {
   preloadPromptCategoriesOptions,
   preloadPromptsOptions,
   preloadPromptTemplateCategoriesOptions,
   preloadPromptTemplatesOptions,
} from "@/data/ts-queries/prompt";

export type PromptsLayoutProps = {
   children: React.ReactNode;
};

const PromptsLayout = async (props: Readonly<PromptsLayoutProps>) => {
   const queryClient = new QueryClient();
   await queryClient.prefetchQuery(preloadPromptsOptions());
   await queryClient.prefetchQuery(preloadPromptCategoriesOptions());
   await queryClient.prefetchQuery(preloadPromptTemplatesOptions());
   await queryClient.prefetchQuery(preloadPromptTemplateCategoriesOptions());

   const { children } = props;

   return (
      <div className="h-full flex flex-col" data-testid="prompts-layout">
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
         <div className="flex-1 flex overflow-hidden">
            <HydrationBoundary state={dehydrate(queryClient)}>
               <div className="w-96 bg-white border-r border-slate-200 flex flex-col">
                  <PromptsList />
               </div>
               <div className="flex-1 overflow-y-auto bg-slate-50">
                  <div className="max-w-5xl mx-auto p-8">{children}</div>
               </div>
            </HydrationBoundary>
         </div>
      </div>
   );
};

export default PromptsLayout;
