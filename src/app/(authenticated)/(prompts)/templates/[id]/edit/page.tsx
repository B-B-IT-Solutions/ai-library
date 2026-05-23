import { Metadata } from "next";
import { notFound } from "next/navigation";

import { TemplateEdit } from "@/components/prompts";
import { getPromptWithContent } from "@/data/actions/prompt";
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

export const EditPromptPage = async ({ params }: PageProps) => {
   const { id: promptId } = await params;

   const [prompt, globalFields] = await Promise.all([
      getPromptWithContent(promptId),
      getGlobalPromptFields(),
   ]);

   if (!prompt) {
      return notFound();
   }

   return (
      <div className="h-screen bg-slate-50" data-testid="prompt-edit-page">
         <TemplateEdit prompt={prompt} globalFields={globalFields} />
      </div>
   );
};

export default EditPromptPage;
