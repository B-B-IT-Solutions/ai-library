import { Metadata } from "next";

import { TemplateEdit } from "@/components/templates";
import { getGlobalTemplateFields } from "@/data/actions/settings";

export const metadata: Metadata = {
   title: "Neue Vorlage",
};

export const NewTemplatePage = async () => {
   const globalFields = await getGlobalTemplateFields();

   return (
      <div
         className="flex h-screen flex-col bg-slate-50"
         data-testid="new-template-page"
      >
         <TemplateEdit globalFields={globalFields} />
      </div>
   );
};

export default NewTemplatePage;
