import {
   ItemDetailsView,
   ItemDetailsViewBody,
   ItemDetailsViewBreadcrumbs,
   ItemDetailsViewContent,
   ItemDetailsViewHeader,
} from "@/components/shared/wrappers/item-details";
import { DPrompt, DPrompt } from "@/data/types/domain/prompt";
import { TemplateBreadcrumb } from "../../breadcrumbs";

import { TemplateViewForm } from "./template-view-form";

type Props = {
   descriptor: DPrompt;
   template: DPrompt;
};

export const TemplateView = ({ descriptor, template }: Props) => {
   return (
      <ItemDetailsView data-testid="template-view">
         <ItemDetailsViewHeader>
            <h1 className="text-2xl font-bold text-slate-900">
               {descriptor.title}
            </h1>
         </ItemDetailsViewHeader>
         <ItemDetailsViewContent>
            <ItemDetailsViewBreadcrumbs>
               <TemplateBreadcrumb variant="view" label={descriptor.title} />
            </ItemDetailsViewBreadcrumbs>
            <ItemDetailsViewBody>
               <TemplateViewForm descriptor={descriptor} template={template} />
            </ItemDetailsViewBody>
         </ItemDetailsViewContent>
      </ItemDetailsView>
   );
};
