import { Metadata } from "next";
import { notFound } from "next/navigation";

import { PromptView } from "@/components/prompts";
import { getCollectionPreviewById } from "@/data/actions/collection";
import { getPrompt, getPromptWithContent } from "@/data/actions/prompt";

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

export async function generateMetadata({
   params,
}: PageProps): Promise<Metadata> {
   const { id } = await params;
   const prompt = await getPrompt(id);
   return {
      title: prompt?.title ?? "Prompt",
   };
}

export const PromptPage = async ({ params, searchParams }: PageProps) => {
   const { id: promptId } = await params;
   const { collectionId } = await searchParams;

   const [prompt, collection] = await Promise.all([
      getPromptWithContent(promptId),
      collectionId
         ? getCollectionPreviewById(collectionId)
         : Promise.resolve(null),
   ]);

   if (!prompt) {
      return notFound();
   }

   return (
      <div className="h-screen bg-slate-50" data-testid="prompt-view-page">
         <PromptView prompt={prompt} collection={collection || undefined} />
      </div>
   );
};

export default PromptPage;
