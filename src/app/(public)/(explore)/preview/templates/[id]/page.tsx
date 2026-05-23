import { Metadata } from "next";
import { notFound } from "next/navigation";

import { PublicPromptView } from "@/components/prompts";
import { getPublicCollectionByToken } from "@/data/actions/collection";
import { getPublicPrompt, getPublicPromptContent } from "@/data/actions/prompt";

export const generateMetadata = async ({
   params,
}: PageProps): Promise<Metadata> => {
   const { id } = await params;
   const descriptor = await getPublicPrompt(id);
   if (!descriptor) {
      return { title: "Vorlage nicht gefunden" };
   }
   return {
      title: descriptor.title,
      description: descriptor.description,
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

export const PublicTemplatePage = async ({
   params,
   searchParams,
}: PageProps) => {
   const { id } = await params;
   const { col: colToken } = await searchParams;

   const prompt = await getPublicPrompt(id);

   if (!prompt) {
      return notFound();
   }

   const [template, collection] = await Promise.all([
      getPublicPromptContent(prompt.id),
      colToken ? getPublicCollectionByToken(colToken) : Promise.resolve(null),
   ]);

   if (!template) {
      return notFound();
   }

   return (
      <div data-testid="public-prompt-view-page">
         <PublicPromptView
            descriptor={prompt}
            template={template}
            collection={collection}
         />
      </div>
   );
};

export default PublicTemplatePage;
