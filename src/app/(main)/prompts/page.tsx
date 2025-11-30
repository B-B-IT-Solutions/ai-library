import {
   dehydrate,
   HydrationBoundary,
   QueryClient,
} from "@tanstack/react-query";

import { getPrompts } from "@/data/actions/prompt/prompt.actions";
import {
   preloadPromptTemplateCategoriesOptions,
   preloadPromptTemplatesOptions,
} from "@/data/ts-queries/prompt";

import { PromptManager } from "./library";

export const metadata = {
   title: "Prompts",
};

const PromptsPage = async () => {
   const promptsPage = await getPrompts({
      pagination: { pageNumber: 1, pageSize: 10 },
   });

   console.log(promptsPage);

   const queryClient = new QueryClient();
   await queryClient.prefetchQuery(preloadPromptTemplatesOptions());
   await queryClient.prefetchQuery(preloadPromptTemplateCategoriesOptions());

   return (
      <div className="w-full" data-testid="prompts-page">
         <HydrationBoundary state={dehydrate(queryClient)}>
            <PromptManager prompts={promptsPage.content} />
         </HydrationBoundary>
      </div>
   );
};

export default PromptsPage;
