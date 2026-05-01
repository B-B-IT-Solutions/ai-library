import { Metadata } from "next";
import { notFound } from "next/navigation";

import { PublicTemplateView } from "@/components/templates/template/view/template-view-public";
import {
   getPromptTemplate,
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

   const template = await getPromptTemplate(descriptor.promptTemplateId);

   if (!template) {
      return notFound();
   }

   return <PublicTemplateView descriptor={descriptor} template={template} />;
};

export default PublicTemplatePage;
