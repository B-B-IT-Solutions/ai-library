import { DEFAULT_PROMPT_MODEL_NAMES } from "./constants";

const expectedDefaultPromptModelNames = [
   "Claude",
   "ChatGPT",
   "Gemini",
   "Perplexity",
   "Midjourney",
];

describe("constants tests", () => {
   it("DEFAULT_PROMPT_MODEL_NAMES test", async () => {
      expect(DEFAULT_PROMPT_MODEL_NAMES).toEqual(
         expectedDefaultPromptModelNames
      );
   });
});
