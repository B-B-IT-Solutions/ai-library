import { Metadata } from "next";
import type { SearchParams } from "nuqs/server";

import { Prompt0sDashboard } from "@/components/prompt0s";

export const metadata: Metadata = {
   title: "Prompts",
};

export type PageProps = {
   searchParams: Promise<SearchParams>;
};

export const PromptsPage = async (props: PageProps) => {
   return (
      <div data-testid="prompts-page" className="h-full">
         <Prompt0sDashboard />
      </div>
   );
};

export default PromptsPage;
