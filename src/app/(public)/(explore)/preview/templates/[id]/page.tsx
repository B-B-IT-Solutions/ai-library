import { Metadata } from "next";
import { notFound } from "next/navigation";

import { PublicPromptView } from "@/components/prompts";
import { getPublicCollectionByToken } from "@/data/actions/collection";
import { getPublicPrompt, getPublicPromptContent } from "@/data/actions/prompt";

export const generateMetadata = async ({
   params,
}: PageProps): Promise<Metadata> => {
   const { id } = await params;
   const prompt = await getPublicPrompt(id);
   if (!prompt) {
      return { title: "Prompt nicht gefunden" };
   }
   return {
      title: prompt.title,
      description: prompt.description,
   };
};

export type PageParams = {
   id: string;
};

export type PageSearchParams = {
   col?: string;
};

export type PageProps = {
   params: Promise<PageParams>;
   searchParams: Promise<PageSearchParams>;
};

export const PublicPromptPage = async ({ params, searchParams }: PageProps) => {
   const { id } = await params;
   const { col: colToken } = await searchParams;

   const [prompt, collection] = await Promise.all([
      getPublicPromptContent(id),
      colToken ? getPublicCollectionByToken(colToken) : Promise.resolve(null),
   ]);

   if (!prompt) {
      return notFound();
   }

   return (
      <div data-testid="public-prompt-page">
         <PublicPromptView prompt={prompt} collection={collection} />
      </div>
   );
};

export default PublicPromptPage;
