import {
   dehydrate,
   HydrationBoundary,
   QueryClient,
} from "@tanstack/react-query";

import { getPrompts } from "@/lib/actions/prompt/prompt.actions";
import {
   getPromptTemplateCategories,
   getPromptTemplates,
} from "@/lib/actions/prompt/prompt.template.actions";

import PromptManager from "./library";

export const metadata = {
   title: "Prompts",
};

const PromptsPage = async () => {
   const prompts = await getPrompts();

   const queryClient = new QueryClient();

   await queryClient.prefetchQuery({
      queryKey: ["prompt-templates"],
      queryFn: async () => {
         return await getPromptTemplates();
      },
   });

   await queryClient.prefetchQuery({
      queryKey: ["prompt-template-categories"],
      queryFn: async () => {
         return await getPromptTemplateCategories();
      },
   });

   return (
      <div className="w-full" data-testid="prompts-page">
         <HydrationBoundary state={dehydrate(queryClient)}>
            <PromptManager prompts={prompts} />
         </HydrationBoundary>
      </div>
   );
};

export default PromptsPage;
