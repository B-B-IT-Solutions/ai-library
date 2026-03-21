import { find } from "es-toolkit/compat";

import { AiTool } from "./type";

const aiTools: AiTool[] = [
   {
      id: "gpt",
      name: "ChatGPT",
      url: "https://chatgpt.com/",
      queryParam: "q",
   },
   {
      id: "claude",
      name: "Claude",
      url: "https://claude.ai/new",
      queryParam: "q",
   },
   {
      id: "gemini",
      name: "Gemini",
      url: "https://google.com/search",
      queryParam: "udm=50&q",
   },
   {
      id: "perplexity",
      name: "Perplexity",
      url: "https://www.perplexity.ai/",
      queryParam: "q",
   },
];

export const getRecommendedAiTool = (model?: string) => {
   if (model) {
      const lower = model.toLowerCase();
      return find(aiTools, (t) => lower.includes(t.id));
   }
   return undefined;
};

export const getOtherAiTools = (tool?: AiTool) => {
   return aiTools.filter((s) => s.name !== tool?.name);
};
