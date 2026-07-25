import { Metadata } from "next";
import type { SearchParams } from "nuqs/server";

import {
   PromptsDashboard,
   templatesSearchParamsCache,
} from "@/components/prompts";

export const metadata: Metadata = {
   title: "Meine Prompts",
};

export type PageProps = {
   searchParams: Promise<SearchParams>;
};

export const PromptsPage = async (props: PageProps) => {
   await templatesSearchParamsCache.parse(props.searchParams);

   return (
      <div data-testid="templates-page" className="h-full">
         <PromptsDashboard />
      </div>
   );
};

export default PromptsPage;
