import { Metadata } from "next";
import type { SearchParams } from "nuqs/server";

import { PromptsDashboard } from "@/components/prompts";

export const metadata: Metadata = {
   title: "Prompts",
};

export type PageProps = {
   searchParams: Promise<SearchParams>;
};

export const PromptsPage = async (props: PageProps) => {
   return (
      <div data-testid="prompts-page" className="h-full">
         <PromptsDashboard />
      </div>
   );
};

export default PromptsPage;
