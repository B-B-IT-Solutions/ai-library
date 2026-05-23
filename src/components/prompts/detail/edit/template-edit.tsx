import {
   ItemDetailsEdit,
   ItemDetailsEditBody,
   ItemDetailsEditBreadcrumbs,
   ItemDetailsEditContent,
   ItemDetailsEditHeader,
} from "@/components/shared/wrappers/item-details";
import { DPromptWithContent } from "@/data/types/domain/prompt";
import { DGlobalPromptField } from "@/data/types/domain/settings";
import { TemplateBreadcrumb } from "../../breadcrumbs";

import { TemplateEditForm } from "./template-edit-form";

type Props = {
   prompt?: DPromptWithContent;
   collectionId?: string;
   globalFields: DGlobalPromptField[];
};

export const TemplateEdit = ({ prompt, collectionId, globalFields }: Props) => {
   const header = () => {
      const title = prompt ? "Prompt Bearbeiten" : "Neuen Prompt Erstellen";
      const text = prompt
         ? "Bearbeiten Sie den Prompt"
         : "Erstellen Sie einen neuen Prompt";

      return (
         <>
            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
            <p className="mt-0.5 text-sm text-slate-600">{text}</p>
         </>
      );
   };

   const breadcrumbs = () => {
      if (prompt) {
         return (
            <TemplateBreadcrumb
               variant="edit"
               label={prompt.title}
               entryId={prompt.id}
            />
         );
      }
      return <TemplateBreadcrumb variant="new" />;
   };

   return (
      <ItemDetailsEdit data-testid="template-edit">
         <ItemDetailsEditHeader>{header()}</ItemDetailsEditHeader>
         <ItemDetailsEditContent>
            <ItemDetailsEditBreadcrumbs>
               {breadcrumbs()}
            </ItemDetailsEditBreadcrumbs>
            <ItemDetailsEditBody>
               <TemplateEditForm
                  prompt={prompt}
                  collectionId={collectionId}
                  globalFields={globalFields}
               />
            </ItemDetailsEditBody>
         </ItemDetailsEditContent>
      </ItemDetailsEdit>
   );
};
