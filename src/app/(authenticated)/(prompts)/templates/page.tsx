import { Metadata } from "next";
import type { SearchParams } from "nuqs/server";

import {
   templatesSearchParamsCache,
   TemplatesDashboard,
} from "@/components/templates";

export const metadata: Metadata = {
   title: "Meine Vorlagen",
};

export type PageProps = {
   searchParams: Promise<SearchParams>;
};

export const TemplatesPage = async (props: PageProps) => {
   await templatesSearchParamsCache.parse(props.searchParams);

   return (
      <div data-testid="templates-page" className="h-full">
         <TemplatesDashboard />
      </div>
   );
};

export default TemplatesPage;
