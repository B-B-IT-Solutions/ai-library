import {
   ItemDetailsEdit,
   ItemDetailsEditBody,
   ItemDetailsEditBreadcrumbs,
   ItemDetailsEditContent,
   ItemDetailsEditHeader,
} from "@/components/shared/wrappers/item-details";
import { DPrompt, DPromptWithContent } from "@/data/types/domain/prompt";
import { DGlobalPromptField } from "@/data/types/domain/settings";
import { TemplateBreadcrumb } from "../../breadcrumbs";

import { TemplateEditForm } from "./template-edit-form";

type Props = {
   descriptor?: DPrompt;
   template?: DPromptWithContent;
   collectionId?: string;
   globalFields: DGlobalPromptField[];
};

export const TemplateEdit = ({
   descriptor,
   template,
   collectionId,
   globalFields,
}: Props) => {
   const header = () => {
      const title = descriptor ? "Prompt Bearbeiten" : "Neuen Prompt Erstellen";
      const text = descriptor
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
      if (descriptor) {
         return (
            <TemplateBreadcrumb
               variant="edit"
               label={descriptor.title}
               entryId={descriptor.id}
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
                  descriptor={descriptor}
                  template={template}
                  collectionId={collectionId}
                  globalFields={globalFields}
               />
            </ItemDetailsEditBody>
         </ItemDetailsEditContent>
      </ItemDetailsEdit>
   );
};
