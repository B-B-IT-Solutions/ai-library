import { Metadata } from "next";

import { TemplateEdit } from "@/components/prompts";
import { getGlobalPromptFields } from "@/data/actions/settings";

export const metadata: Metadata = {
   title: "Neuer Prompt",
};

export type PageSearchParams = {
   collectionId?: string;
};

export type PageProps = {
   searchParams: Promise<PageSearchParams>;
};

export const NewPromptPage = async ({ searchParams }: PageProps) => {
   const { collectionId } = await searchParams;
   const globalFields = await getGlobalPromptFields();

   return (
      <div
         className="flex h-screen flex-col bg-slate-50"
         data-testid="new-prompt-page"
      >
         <TemplateEdit
            collectionId={collectionId}
            globalFields={globalFields}
         />
      </div>
   );
};

export default NewPromptPage;
