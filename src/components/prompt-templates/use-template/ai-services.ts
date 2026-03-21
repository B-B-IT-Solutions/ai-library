import { find } from "es-toolkit/compat";

import { AiTool } from "./type";

const aiTools: AiTool[] = [
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

export const getRecommendedAiTool = (model?: string) => {
   if (model) {
      const lower = model.toLowerCase();
      return find(aiTools, (s) => s.keywords.some((kw) => lower.includes(kw)));
   }
   return undefined;
};

export const getOtherAiTools = (tool?: AiTool) => {
   return aiTools.filter((s) => s.name !== tool?.name);
};
