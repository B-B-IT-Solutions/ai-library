import { notFound } from "next/navigation";

import { PromptView } from "@/components/prompt0s";
import { getPrompt } from "@/data/actions/prompt0";

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
      <div className="h-screen bg-slate-50" data-testid="prompt-page">
         <PromptView prompt={prompt} />
      </div>
   );
};

export default PromptPage;
