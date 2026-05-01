import { Metadata } from "next";
import { notFound } from "next/navigation";

import { PublicTemplateView } from "@/components/templates";
import {
   getPublicPromptTemplate,
   getPublicTemplateDescriptor,
} from "@/data/actions/template";

export const generateMetadata = async ({
   params,
}: PageProps): Promise<Metadata> => {
   const { id } = await params;
   const descriptor = await getPublicTemplateDescriptor(id);
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

export type PageProps = {
   params: Promise<PageParams>;
};

export const PublicTemplatePage = async ({ params }: PageProps) => {
   const { id } = await params;
   const descriptor = await getPublicTemplateDescriptor(id);

   if (!descriptor) {
      return notFound();
   }

   const template = await getPublicPromptTemplate(descriptor.promptTemplateId);

   if (!template) {
      return notFound();
   }

   return (
      <div
         className="h-screen bg-slate-50"
         data-testid="public-template-view-page"
      >
         <PublicTemplateView descriptor={descriptor} template={template} />
      </div>
   );
};

export default PublicTemplatePage;
