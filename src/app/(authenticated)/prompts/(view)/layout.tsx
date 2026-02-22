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
      <div className="flex h-full flex-col" data-testid="prompts-layout">
         <div className="border-b border-slate-200 bg-white px-6 py-4">
            <div className="flex items-center justify-between">
               <div>
                  <h1 className="text-2xl font-bold text-slate-900">Prompts</h1>
                  <p className="mt-0.5 text-sm text-slate-600">
                     Manage your AI prompt library with version control
                  </p>
               </div>
            </div>
         </div>
         <div className="flex flex-1 overflow-hidden">
            <HydrationBoundary state={dehydrate(queryClient)}>
               <div className="flex w-96 flex-col border-r border-slate-200 bg-white">
                  <PromptsList />
               </div>
               <div className="flex-1 overflow-y-auto bg-slate-50">
                  <div className="mx-auto max-w-5xl p-8">{children}</div>
               </div>
            </HydrationBoundary>
         </div>
      </div>
   );
};

export default PromptsLayout;
