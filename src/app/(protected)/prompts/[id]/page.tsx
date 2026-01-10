import {
   dehydrate,
   HydrationBoundary,
   QueryClient,
} from "@tanstack/react-query";
import { notFound } from "next/navigation";

import { PromptView, PromptsList } from "@/components/prompts";
import { getPrompt } from "@/data/actions/prompt";
import {
   preloadPromptCategoriesOptions,
   preloadPromptsOptions,
} from "@/data/ts-queries/prompt";

export const metadata = {
   title: "Prompt",
};

type PageParams = { id: string };

export type PromptPageProps = {
   params: Promise<PageParams>;
};

const PromptPage = async (props: PromptPageProps) => {
   const { id } = await props.params;

   const prompt = await getPrompt(id);

   if (!prompt) {
      return notFound();
   }

   // Prefetch list data for master-detail view
   const queryClient = new QueryClient();
   await queryClient.prefetchQuery(preloadPromptsOptions());
   await queryClient.prefetchQuery(preloadPromptCategoriesOptions());

   return (
      <div
         className="h-screen flex flex-col bg-slate-50"
         data-testid="prompt-page"
      >
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
                     <PromptView prompt={prompt} />
                  </div>
               </div>
            </HydrationBoundary>
         </div>
      </div>
   );
};

export default PromptPage;
