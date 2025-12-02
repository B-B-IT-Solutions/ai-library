import { PromptCreateEdit } from "@/components/prompts/prompt";

export const metadata = {
   title: "Create Prompt",
};

const CreatePromptPage = async () => {
   return (
      <div data-testid="create-prompt-page">
         <PromptCreateEdit />
      </div>
   );
};

export default CreatePromptPage;
