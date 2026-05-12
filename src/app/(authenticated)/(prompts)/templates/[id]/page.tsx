import { Metadata } from "next";
import { notFound } from "next/navigation";

import { TemplateView } from "@/components/templates";
import {
   getPromptTemplate,
   getTemplateDescriptor,
} from "@/data/actions/template";

export const metadata: Metadata = {
   title: "Vorlage",
};

export type PageParams = {
   id: string;
};

export type PageProps = {
   params: Promise<PageParams>;
};

export const TemplatePage = async ({ params }: PageProps) => {
   const { id: descriptorId } = await params;
   const descriptor = await getTemplateDescriptor(descriptorId);

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
