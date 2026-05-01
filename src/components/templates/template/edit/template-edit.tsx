import {
   ItemDetailsEdit,
   ItemDetailsEditBody,
   ItemDetailsEditBreadcrumbs,
   ItemDetailsEditContent,
   ItemDetailsEditHeader,
} from "@/components/shared/wrappers/item-details";
import { DPromptTemplateDescriptor } from "@/data/types/domain/prompt.template";
import { DGlobalTemplateField } from "@/data/types/domain/settings";
import { TemplateBreadcrumb } from "../../breadcrumbs";

import { TemplateEditForm } from "./template-edit-form";

type Props = {
   descriptor?: DPromptTemplateDescriptor;
   globalFields: DGlobalTemplateField[];
};

export const TemplateEdit = ({ descriptor, globalFields }: Props) => {
   const header = () => {
      const title = descriptor
         ? "Vorlage Bearbeiten"
         : "Neue Vorlage Erstellen";
      const text = descriptor
         ? "Bearbeiten Sie die Vorlage"
         : "Erstellen Sie eine neue Vorlage";

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
                  globalFields={globalFields}
               />
            </ItemDetailsEditBody>
         </ItemDetailsEditContent>
      </ItemDetailsEdit>
   );
};
