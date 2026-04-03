import {
   ItemDetailsView,
   ItemDetailsViewBody,
   ItemDetailsViewBreadcrumbs,
   ItemDetailsViewContent,
   ItemDetailsViewHeader,
} from "@/components/shared/wrappers/item-details";
import { DPromptTemplateDescriptorWithTemplate } from "@/data/types/domain/prompt.template";
import { LibraryEntryBreadcrumb } from "../../breadcrumbs";

import { LibraryEntryViewForm } from "./library-entry-view-form";

type Props = {
   descriptor: DPromptTemplateDescriptorWithTemplate;
};

export const LibraryEntryView = ({ descriptor }: Props) => {
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
                  label={descriptor.title}
               />
            </ItemDetailsViewBreadcrumbs>
            <ItemDetailsViewBody>
               <LibraryEntryViewForm descriptor={descriptor} />
            </ItemDetailsViewBody>
         </ItemDetailsViewContent>
      </ItemDetailsView>
   );
};
