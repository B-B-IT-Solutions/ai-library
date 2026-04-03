import { Metadata } from "next";
import { notFound } from "next/navigation";

import { TemplateEdit } from "@/components/templates";
import { getTemplateDescriptor } from "@/data/actions/prompt-template";
import { getGlobalTemplateFields } from "@/data/actions/settings";

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

   const [entry, globalFields] = await Promise.all([
      getTemplateDescriptor(descriptorId),
      getGlobalTemplateFields(),
   ]);

   if (!entry) {
      return notFound();
   }

   return (
      <div className="h-screen bg-slate-50" data-testid="template-edit-page">
         <TemplateEdit descriptor={entry} globalFields={globalFields} />
      </div>
   );
};

export default EditTemplatePage;
