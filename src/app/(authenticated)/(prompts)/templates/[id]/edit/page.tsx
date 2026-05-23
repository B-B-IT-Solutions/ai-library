import { Metadata } from "next";
import { notFound } from "next/navigation";

import { TemplateEdit } from "@/components/prompts";
import { getPrompt, getPromptWithContent } from "@/data/actions/prompt";
import { getGlobalPromptFields } from "@/data/actions/settings";

export const metadata: Metadata = {
   title: "Vorlage Bearbeiten",
};

export type PageParams = {
   id: string;
};

export type PageProps = {
   params: Promise<PageParams>;
};

export const EditTemplatePage = async ({ params }: PageProps) => {
   const { id: promptId } = await params;

   const [prompt, globalFields] = await Promise.all([
      getPrompt(promptId),
      getGlobalPromptFields(),
   ]);

   if (!prompt) {
      return notFound();
   }

   const template = await getPromptWithContent(prompt.id);

   if (!template) {
      return notFound();
   }

   return (
      <div className="h-screen bg-slate-50" data-testid="template-edit-page">
         <TemplateEdit
            prompt={prompt}
            template={template}
            globalFields={globalFields}
         />
      </div>
   );
};

export default EditTemplatePage;
