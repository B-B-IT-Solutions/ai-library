import { PromptView } from "@/components/prompts";

export const metadata = {
   title: "Prompts",
};

const PromptsPage = async () => {
   return (
      <div className="h-full" data-testid="prompts-page">
         <PromptView />
      </div>
   );
};

export default PromptsPage;
