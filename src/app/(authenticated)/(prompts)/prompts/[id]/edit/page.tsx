import { notFound } from "next/navigation";

import { PromptEdit } from "@/components/prompt0s";
import { getPrompt } from "@/data/actions/prompt0";

export const metadata = {
   title: "Prompt Bearbeiten",
};

type PageParams = { id: string };

export type PageProps = {
   params: Promise<PageParams>;
};

const EditPromptPage = async (props: PageProps) => {
   const { id } = await props.params;

   const prompt = await getPrompt(id);

   if (!prompt) {
      return notFound();
   }

   return (
      <div className="h-screen bg-slate-50" data-testid="prompt-edit-page">
         <PromptEdit prompt={prompt} />
      </div>
   );
};

export default EditPromptPage;
