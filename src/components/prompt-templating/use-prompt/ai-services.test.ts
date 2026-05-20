import { find } from "es-toolkit/compat";

import { aiTools, getOtherAiTools, getRecommendedAiTool } from "./ai-services";
import { AiTool } from "./type";

const expectedAiTools: AiTool[] = [
   {
      id: "chatgpt",
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

describe("aiTools tests", () => {
   it("aiTools - test", async () => {
      expect(aiTools).toEqual(expectedAiTools);
   });

   it("getRecommendedAiTool - test", async () => {
      const result1 = getRecommendedAiTool("chatgpt");
      const expectedResult1 = find(expectedAiTools, (t) =>
         "chatgpt".includes(t.id)
      );
      expect(result1).toEqual(expectedResult1);

      const result2 = getRecommendedAiTool("Claude 4.6");
      const expectedResult2 = find(expectedAiTools, (t) =>
         "claude".includes(t.id)
      );
      expect(result2).toEqual(expectedResult2);

      const result3 = getRecommendedAiTool("Google Gemini");
      const expectedResult3 = find(expectedAiTools, (t) =>
         "gemini".includes(t.id)
      );
      expect(result3).toEqual(expectedResult3);

      const result4 = getRecommendedAiTool("dummy");
      expect(result4).toBeUndefined();

      const result5 = getRecommendedAiTool();
      expect(result5).toBeUndefined();
   });

   it("getOtherAiTools - test", async () => {
      const [first, ...others] = expectedAiTools;
      const result = getOtherAiTools(first);
      expect(result).toEqual(others);
   });
});
