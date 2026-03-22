import {
   ItemDetailsView,
   ItemDetailsViewBody,
   ItemDetailsViewBreadcrumbs,
   ItemDetailsViewContent,
   ItemDetailsViewHeader,
} from "@/components/shared/wrappers/item-details";
import { DPromptDescriptor } from "@/data/types/domain/prompt";

import { PromptViewForm } from "./prompt-view-form";

type Props = {
   prompt: DPromptDescriptor;
};

export const PromptView = ({ prompt }: Props) => {
   return (
      <ItemDetailsView data-testid="prompt-view">
         <ItemDetailsViewHeader>
            <h1 className="text-2xl font-bold text-slate-900">
               {prompt.title}
            </h1>
         </ItemDetailsViewHeader>
         <ItemDetailsViewContent>
            <ItemDetailsViewBreadcrumbs>Breadcrumb</ItemDetailsViewBreadcrumbs>
            <ItemDetailsViewBody>
               <PromptViewForm prompt={prompt} />
            </ItemDetailsViewBody>
         </ItemDetailsViewContent>
      </ItemDetailsView>
   );
};
