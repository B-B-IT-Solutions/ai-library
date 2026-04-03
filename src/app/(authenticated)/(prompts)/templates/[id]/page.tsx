import { Metadata } from "next";
import { notFound } from "next/navigation";

import { TemplateView } from "@/components/templates";
import { getTemplateDescriptor } from "@/data/actions/prompt-template";

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

   return (
      <div className="h-screen bg-slate-50" data-testid="template-view-page">
         <TemplateView descriptor={descriptor} />
      </div>
   );
};

export default TemplatePage;
