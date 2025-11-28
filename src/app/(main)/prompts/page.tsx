import {
   dehydrate,
   HydrationBoundary,
   QueryClient,
} from "@tanstack/react-query";

import {
   preloadPromptTemplateCategoriesOptions,
   preloadPromptTemplatesOptions,
} from "@/data/ts-queries/prompt";
import { getPrompts } from "@/data/actions/prompt/prompt.actions";

import PromptManager from "./library";

export const metadata = {
   title: "Prompts",
};

const PromptsPage = async () => {
   const prompts = await getPrompts();

   const queryClient = new QueryClient();
   await queryClient.prefetchQuery(preloadPromptTemplatesOptions());
   await queryClient.prefetchQuery(preloadPromptTemplateCategoriesOptions());

   return (
      <div className="w-full" data-testid="prompts-page">
         <HydrationBoundary state={dehydrate(queryClient)}>
            <PromptManager prompts={prompts} />
         </HydrationBoundary>
      </div>
   );
};

export default PromptsPage;
