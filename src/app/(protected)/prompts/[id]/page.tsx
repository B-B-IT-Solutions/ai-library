import {
   dehydrate,
   HydrationBoundary,
   QueryClient,
} from "@tanstack/react-query";
import { notFound } from "next/navigation";

import { PromptFormView, PromptsList } from "@/components/prompts/prompt";
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
         className="h-full w-full text-slate-900 flex flex-col"
         data-testid="prompt-page"
      >
         <div className="flex-1">
            <header className="mb-8">
               <h2 className="text-3xl font-bold text-slate-900 mb-2">
                  Prompt Details
               </h2>
               <p className="text-slate-600">
                  View prompt details, version history, and follow-up prompts
               </p>
            </header>
            <HydrationBoundary state={dehydrate(queryClient)}>
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1">
                     <PromptsList />
                  </div>
                  <div className="lg:col-span-2">
                     <PromptFormView prompt={prompt} />
                  </div>
               </div>
            </HydrationBoundary>
         </div>
      </div>
   );
};

export default PromptPage;
