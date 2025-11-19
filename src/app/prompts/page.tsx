import PromptManager from "./library";

export const metadata = {
  title: "Prompts",
};

const PromptsPage = async () => {
  return (
    <div data-testid="prompts-page">
      <PromptManager />
    </div>
  );
};

export default PromptsPage;
