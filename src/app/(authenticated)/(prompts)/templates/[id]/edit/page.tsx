import { Metadata } from "next";
import { notFound } from "next/navigation";

import { TemplateEdit } from "@/components/prompts";
import { getPrompt, getPromptTemplate } from "@/data/actions/prompt";
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
   const { id: descriptorId } = await params;

   const [descriptor, globalFields] = await Promise.all([
      getPrompt(descriptorId),
      getGlobalPromptFields(),
   ]);

   if (!descriptor) {
      return notFound();
   }

   const template = await getPromptTemplate(descriptor.id);

   if (!template) {
      return notFound();
   }

   return (
      <div className="h-screen bg-slate-50" data-testid="template-edit-page">
         <TemplateEdit
            descriptor={descriptor}
            template={template}
            globalFields={globalFields}
         />
      </div>
   );
};

export default EditTemplatePage;
