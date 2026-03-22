import {
   ItemDetailsView,
   ItemDetailsViewBody,
   ItemDetailsViewBreadcrumbs,
   ItemDetailsViewContent,
   ItemDetailsViewHeader,
} from "@/components/shared/wrappers/item-details";
import { DLibraryEntryWithPromptTemplate } from "@/data/types/domain/library";
import { LibraryEntryBreadcrumb } from "../../breadcrumbs";

import { LibraryEntryViewForm } from "./library-entry-view-form";

type Props = {
   entry: DLibraryEntryWithPromptTemplate;
};

export const LibraryEntryView = ({ entry }: Props) => {
   const { templateDescriptor: descriptor } = entry;

   return (
      <ItemDetailsView data-testid="library-entry-view">
         <ItemDetailsViewHeader>
            <h1 className="text-2xl font-bold text-slate-900">
               {descriptor.title}
            </h1>
         </ItemDetailsViewHeader>
         <ItemDetailsViewContent>
            <ItemDetailsViewBreadcrumbs>
               <LibraryEntryBreadcrumb
                  variant="view"
                  title={descriptor.title}
               />
            </ItemDetailsViewBreadcrumbs>
            <ItemDetailsViewBody>
               <LibraryEntryViewForm entry={entry} />
            </ItemDetailsViewBody>
         </ItemDetailsViewContent>
      </ItemDetailsView>
   );
};
