import { Prompt0Edit } from "@/components/prompt0s";

export const metadata = {
   title: "Neuer Prompt",
};

export const NewPromptPage = async () => {
   return (
      <div
         className="flex h-screen flex-col bg-slate-50"
         data-testid="prompt-new-page"
      >
         <Prompt0Edit />
      </div>
   );
};

export default NewPromptPage;
