export const metadata = {
   title: "Prompt",
};

export type PromptPageProps = {
   params: Promise<{ id: string }>;
};

const PromptPage = async () => {
   return <div data-testid="prompt-page"></div>;
};

export default PromptPage;
