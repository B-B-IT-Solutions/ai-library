import {
   ItemDetailsEdit,
   ItemDetailsEditBody,
   ItemDetailsEditBreadcrumbs,
   ItemDetailsEditContent,
   ItemDetailsEditHeader,
} from "@/components/shared/wrappers/item-details";
import { DLibraryEntryWithPromptTemplate } from "@/data/types/domain/library";
import { DGlobalTemplateField } from "@/data/types/domain/settings";
import { LibraryEntryBreadcrumb } from "../../breadcrumbs";

import { LibraryEntryEditForm } from "./library-entry-edit-form";

type Props = {
   entry?: DLibraryEntryWithPromptTemplate;
   globalFields: DGlobalTemplateField[];
};

export const LibraryEntryEdit = ({ entry, globalFields }: Props) => {
   const header = () => {
      const title = entry ? "Vorlage Bearbeiten" : "Neue Vorlage Erstellen";
      const text = entry
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
      if (entry) {
         return (
            <LibraryEntryBreadcrumb
               variant="edit"
               label={entry.templateDescriptor.title}
               entryId={entry.id}
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
                  entry={entry}
                  globalFields={globalFields}
               />
            </ItemDetailsEditBody>
         </ItemDetailsEditContent>
      </ItemDetailsEdit>
   );
};
