import { Metadata } from "next";

import { PromptEdit } from "@/components/prompts";
import { getCollectionById } from "@/data/actions/collection";
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

   const [globalFields, collection] = await Promise.all([
      getGlobalPromptFields(),
      collectionId ? getCollectionById(collectionId) : Promise.resolve(null),
   ]);

   return (
      <div
         className="flex h-screen flex-col bg-slate-50"
         data-testid="new-prompt-page"
      >
         <PromptEdit
            collection={collection || undefined}
            globalFields={globalFields}
         />
      </div>
   );
};

export default NewPromptPage;
