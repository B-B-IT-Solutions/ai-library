import {
   ItemDetailsEdit,
   ItemDetailsEditBody,
   ItemDetailsEditBreadcrumbs,
   ItemDetailsEditContent,
   ItemDetailsEditHeader,
} from "@/components/shared/wrappers/item-details";
import { DPrompt0 } from "@/data/types/domain/prompt0";
import { PromptBreadcrumb } from "../../breadcrumbs";

import { Prompt0EditForm } from "./prompt0-edit-form";

type Props = {
   prompt?: DPrompt0;
};

export const Prompt0Edit = ({ prompt }: Props) => {
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

   const breadcrumbs = () => {
      if (prompt) {
         return (
            <PromptBreadcrumb
               variant="edit"
               label={prompt.title}
               promptId={prompt.id}
            />
         );
      }
      return <PromptBreadcrumb variant="new" />;
   };

   const form = () => {
      if (prompt) {
         return <Prompt0EditForm prompt={prompt} mode="edit" />;
      }
      return <Prompt0EditForm mode="create" />;
   };

   return (
      <ItemDetailsEdit data-testid="prompt-edit">
         <ItemDetailsEditHeader>{header()}</ItemDetailsEditHeader>
         <ItemDetailsEditContent>
            <ItemDetailsEditBreadcrumbs>
               {breadcrumbs()}
            </ItemDetailsEditBreadcrumbs>
            <ItemDetailsEditBody>{form()}</ItemDetailsEditBody>
         </ItemDetailsEditContent>
      </ItemDetailsEdit>
   );
};
