import { Metadata } from "next";
import { notFound } from "next/navigation";

import { PromptView } from "@/components/prompts";
import { getPrompt, getPromptWithContent } from "@/data/actions/prompt";

export type PageParams = {
   id: string;
};

export type PageProps = {
   params: Promise<PageParams>;
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

export const PromptPage = async ({ params }: PageProps) => {
   const { id: promptId } = await params;
   const descriptor = await getPrompt(promptId);

   if (!descriptor) {
      return notFound();
   }

   const template = await getPromptWithContent(descriptor.id);

   if (!template) {
      return notFound();
   }

   return (
      <div className="h-screen bg-slate-50" data-testid="prompt-view-page">
         <PromptView prompt={template} />
      </div>
   );
};

export default PromptPage;
