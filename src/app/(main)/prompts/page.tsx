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
      <div className="w-full" data-testid="prompts-page">
         <HydrationBoundary state={dehydrate(queryClient)}>
            <PromptManager />
         </HydrationBoundary>
      </div>
   );
};

export default PromptsPage;
