import { notFound } from "next/navigation";

import { getPrompt } from "@/data/actions/prompt/prompt.actions";
import { PromptManager } from "../prompt-manager";

export const metadata = {
   title: "Prompt",
};

type PageParams = { id: string };

export type PromptPageProps = {
   params: Promise<PageParams>;
};

const PromptPage = async (props: PromptPageProps) => {
   const { id } = await props.params;

   const prompt = await getPrompt(id);

   if (!prompt) {
      return notFound();
   }

   return (
      <div data-testid="prompt-page">
         <PromptManager prompt={prompt} />
      </div>
   );
};

export default PromptPage;
