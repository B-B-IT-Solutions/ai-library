import { PromptEdit } from "@/components/prompts";

export const PromptCreateEdit = () => {
   const editForm = () => {
      return (
         <div className="space-y-6">
            <PromptEdit mode="create" />
         </div>
      );
   };

   return <div data-testid="prompt-create-edit">{editForm()}</div>;
};
