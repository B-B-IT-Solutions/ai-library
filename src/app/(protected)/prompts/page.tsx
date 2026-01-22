import { PromptView } from "@/components/prompts";

export const metadata = {
   title: "Prompts",
};

const PromptsPage = async () => {
   return (
      <div className="flex flex-col bg-slate-50" data-testid="prompts-page">
         <PromptView />
      </div>
   );
};

export default PromptsPage;
