import { notFound } from "next/navigation";

import { PromptFormEdit } from "@/components/prompts/prompt";
import { getPrompt } from "@/data/actions/prompt";

export const metadata = {
   title: "Edit Prompt",
};

type PageParams = { id: string };

export type EditPromptPageProps = {
   params: Promise<PageParams>;
};

const EditPromptPage = async (props: EditPromptPageProps) => {
   const { id } = await props.params;

   const prompt = await getPrompt(id);

   if (!prompt) {
      return notFound();
   }

   return (
      <div className="h-full w-full" data-testid="edit-prompt-page">
         <header className="mb-6">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
               Edit Prompt
            </h2>
            <p className="text-slate-600">
               Update your prompt. A new version will be created if you modify
               the content.
            </p>
         </header>
         <PromptFormEdit prompt={prompt} mode="edit" />
      </div>
   );
};

export default EditPromptPage;
