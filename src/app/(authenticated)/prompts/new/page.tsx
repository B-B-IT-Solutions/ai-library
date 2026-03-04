import { PromptEdit } from "@/components/prompts";

export const metadata = {
   title: "Neuer Prompt",
};

export const NewPromptPage = async () => {
   return (
      <div
         className="flex h-screen flex-col bg-slate-50"
         data-testid="prompt-new-page"
      >
         <PromptEdit mode="create" />
      </div>
   );
};

export default NewPromptPage;
