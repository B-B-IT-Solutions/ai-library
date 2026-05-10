import { Metadata } from "next";
import { notFound } from "next/navigation";

import { PublicTemplateView } from "@/components/templates";
import { getPublicCollectionByToken } from "@/data/actions/collection";
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

export type PageSearchParams = {
   col?: string;
};

export type PageProps = {
   params: Promise<PageParams>;
   searchParams: Promise<PageSearchParams>;
};

export const PublicTemplatePage = async ({
   params,
   searchParams,
}: PageProps) => {
   const { id } = await params;
   const { col: colToken } = await searchParams;

   const descriptor = await getPublicTemplateDescriptor(id);

   if (!descriptor) {
      return notFound();
   }

   const [template, collection] = await Promise.all([
      getPublicPromptTemplate(descriptor.promptTemplateId),
      colToken ? getPublicCollectionByToken(colToken) : Promise.resolve(null),
   ]);

   if (!template) {
      return notFound();
   }

   return (
      <div data-testid="public-template-view-page">
         <PublicTemplateView
            descriptor={descriptor}
            template={template}
            collection={collection}
         />
      </div>
   );
};

export default PublicTemplatePage;
