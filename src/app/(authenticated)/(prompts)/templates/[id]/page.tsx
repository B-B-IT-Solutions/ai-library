import { Metadata } from "next";
import { notFound } from "next/navigation";

import { TemplateView } from "@/components/prompts";
import { getPrompt, getPromptTemplate } from "@/data/actions/prompt";

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
   const descriptor = await getPrompt(id);
   return {
      title: descriptor?.title ?? "Vorlage",
   };
}

export const TemplatePage = async ({ params }: PageProps) => {
   const { id: descriptorId } = await params;
   const descriptor = await getPrompt(descriptorId);

   if (!descriptor) {
      return notFound();
   }

   const template = await getPromptTemplate(descriptor.id);

   if (!template) {
      return notFound();
   }

   return (
      <div className="h-screen bg-slate-50" data-testid="template-view-page">
         <TemplateView descriptor={descriptor} template={template} />
      </div>
   );
};

export default TemplatePage;
