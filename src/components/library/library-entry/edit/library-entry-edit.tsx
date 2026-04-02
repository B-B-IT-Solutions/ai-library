import {
   ItemDetailsEdit,
   ItemDetailsEditBody,
   ItemDetailsEditBreadcrumbs,
   ItemDetailsEditContent,
   ItemDetailsEditHeader,
} from "@/components/shared/wrappers/item-details";
import { DPromptTemplateDescriptorWithTemplate } from "@/data/types/domain/prompt.template";
import { DGlobalTemplateField } from "@/data/types/domain/settings";
import { LibraryEntryBreadcrumb } from "../../breadcrumbs";

import { LibraryEntryEditForm } from "./library-entry-edit-form";

type Props = {
   descriptor?: DPromptTemplateDescriptorWithTemplate;
   globalFields: DGlobalTemplateField[];
};

export const LibraryEntryEdit = ({ descriptor, globalFields }: Props) => {
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
            <LibraryEntryBreadcrumb
               variant="edit"
               label={descriptor.title}
               entryId={descriptor.id}
            />
         );
      }
      return <LibraryEntryBreadcrumb variant="new" />;
   };

   return (
      <ItemDetailsEdit data-testid="library-entry-edit">
         <ItemDetailsEditHeader>{header()}</ItemDetailsEditHeader>
         <ItemDetailsEditContent>
            <ItemDetailsEditBreadcrumbs>
               {breadcrumbs()}
            </ItemDetailsEditBreadcrumbs>
            <ItemDetailsEditBody>
               <LibraryEntryEditForm
                  descriptor={descriptor}
                  globalFields={globalFields}
               />
            </ItemDetailsEditBody>
         </ItemDetailsEditContent>
      </ItemDetailsEdit>
   );
};
