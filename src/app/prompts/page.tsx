import { getPrompts } from "@/lib/actions/prompt/prompt.actions";
import PromptManager from "./library";

export const metadata = {
   title: "Prompts",
};

const PromptsPage = async () => {
   const prompts = await getPrompts();
   return (
      <div data-testid="prompts-page">
         <PromptManager prompts={prompts} />
      </div>
   );
};

export default PromptsPage;
