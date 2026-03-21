export type AiService = {
   name: string;
   url: string;
   queryParam: string;
   keywords: string[];
};

const AI_SERVICES: AiService[] = [
   {
      name: "ChatGPT",
      url: "https://chatgpt.com/",
      queryParam: "q",
      keywords: ["chatgpt", "gpt", "openai"],
   },
   {
      name: "Claude",
      url: "https://claude.ai/new",
      queryParam: "q",
      keywords: ["claude", "anthropic"],
   },
   {
      name: "Gemini",
      url: "https://google.com/search",
      queryParam: "udm=50&q",
      keywords: ["gemini", "google"],
   },
   {
      name: "Perplexity",
      url: "https://www.perplexity.ai/",
      queryParam: "q",
      keywords: ["perplexity"],
   },
];

export const getRecommendedAiService = (recommendedModel?: string) => {
   if (!recommendedModel) return null;
   const lower = recommendedModel.toLowerCase();
   return (
      AI_SERVICES.find((s) => s.keywords.some((kw) => lower.includes(kw))) ??
      null
   );
};

export const getOtherAiService = (recommended?: AiService | null) => {
   return AI_SERVICES.filter((s) => s.name !== recommended?.name);
};
