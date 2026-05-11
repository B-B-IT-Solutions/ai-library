import { Metadata } from "next";
import { notFound } from "next/navigation";

import { TemplateEdit } from "@/components/templates";
import { getGlobalTemplateFields } from "@/data/actions/settings";
import {
   getPromptTemplate,
   getTemplateDescriptor,
} from "@/data/actions/template";

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
      getTemplateDescriptor(descriptorId),
      getGlobalTemplateFields(),
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
