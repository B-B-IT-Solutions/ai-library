import { Metadata } from "next";
import { notFound } from "next/navigation";

import { PromptEdit } from "@/components/prompts";
import { getCollectionById } from "@/data/actions/collection";
import { getPromptWithContent } from "@/data/actions/prompt";
import { getGlobalPromptFields } from "@/data/actions/settings";

export const metadata: Metadata = {
   title: "Vorlage Bearbeiten",
};

export type PageParams = {
   id: string;
};

export type PageSearchParams = {
   collectionId?: string;
};

export type PageProps = {
   params: Promise<PageParams>;
   searchParams: Promise<PageSearchParams>;
};

export const EditPromptPage = async ({ params, searchParams }: PageProps) => {
   const { id: promptId } = await params;
   const { collectionId } = await searchParams;

   const [prompt, globalFields, collection] = await Promise.all([
      getPromptWithContent(promptId),
      getGlobalPromptFields(),
      collectionId ? getCollectionById(collectionId) : Promise.resolve(null),
   ]);

   if (!prompt) {
      return notFound();
   }

   return (
      <div className="h-screen bg-slate-50" data-testid="prompt-edit-page">
         <PromptEdit
            prompt={prompt}
            globalFields={globalFields}
            collection={collection || undefined}
         />
      </div>
   );
};

export default EditPromptPage;
