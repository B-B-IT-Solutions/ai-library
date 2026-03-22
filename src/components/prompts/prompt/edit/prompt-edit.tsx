import {
   ItemDetailsEdit,
   ItemDetailsEditBody,
   ItemDetailsEditBreadcrumbs,
   ItemDetailsEditContent,
   ItemDetailsEditHeader,
} from "@/components/shared/wrappers/item-details";
import { DPromptDescriptor } from "@/data/types/domain/prompt";

import { PromptEditForm } from "./prompt-edit-form";

type Props = {
   prompt?: DPromptDescriptor;
};

export const PromptEdit = ({ prompt }: Props) => {
   const header = () => {
      const title = prompt ? "Prompt Bearbeiten" : "Neuer Prompt Erstellen";
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

   return (
      <ItemDetailsEdit data-testid="prompt-edit">
         <ItemDetailsEditHeader>{header()}</ItemDetailsEditHeader>
         <ItemDetailsEditContent>
            <ItemDetailsEditBreadcrumbs>Breadcrumbs</ItemDetailsEditBreadcrumbs>
            <ItemDetailsEditBody>
               <PromptEditForm
                  prompt={prompt}
                  mode={prompt ? "edit" : "create"}
               />
            </ItemDetailsEditBody>
         </ItemDetailsEditContent>
      </ItemDetailsEdit>
   );
};
