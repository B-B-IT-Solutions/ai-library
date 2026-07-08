import { calculateLevers, calculateStage } from "./survey-scoring";
import type { SurveyAnswers } from "./survey-data";

describe("calculateStage", () => {
   it("returns 1 for score 8 (minimum)", () => {
      expect(calculateStage(8)).toBe(1);
   });

   it("returns 1 for score 14 (upper boundary of stage 1)", () => {
      expect(calculateStage(14)).toBe(1);
   });

   it("returns 2 for score 15 (lower boundary of stage 2)", () => {
      expect(calculateStage(15)).toBe(2);
   });

   it("returns 2 for score 17 (midpoint stage 2)", () => {
      expect(calculateStage(17)).toBe(2);
   });

   it("returns 2 for score 20 (upper boundary of stage 2)", () => {
      expect(calculateStage(20)).toBe(2);
   });

   it("returns 3 for score 21 (lower boundary of stage 3)", () => {
      expect(calculateStage(21)).toBe(3);
   });

   it("returns 3 for score 24 (midpoint stage 3)", () => {
      expect(calculateStage(24)).toBe(3);
   });

   it("returns 3 for score 26 (upper boundary of stage 3)", () => {
      expect(calculateStage(26)).toBe(3);
   });

   it("returns 4 for score 27 (lower boundary of stage 4)", () => {
      expect(calculateStage(27)).toBe(4);
   });

   it("returns 4 for score 32 (maximum)", () => {
      expect(calculateStage(32)).toBe(4);
   });
});

describe("calculateLevers", () => {
   const makeAnswers = (overrides: Partial<SurveyAnswers> = {}): SurveyAnswers => ({
      freq: 3,
      prompting: 3,
      tooling: 3,
      files: 3,
      automation: 3,
      integration: 3,
      quality: 3,
      timesaving: 3,
      ...overrides,
   });

   it("returns the 2 dimensions with the lowest scores", () => {
      const answers = makeAnswers({ freq: 1, prompting: 2 });
      const [first, second] = calculateLevers(answers);
      expect(first).toBe("freq");
      expect(second).toBe("prompting");
   });

   it("breaks ties by dimension order (earlier dimension wins)", () => {
      // freq and prompting both score 1 — freq comes first in DIMENSION_ORDER
      const answers = makeAnswers({ freq: 1, prompting: 1 });
      const [first, second] = calculateLevers(answers);
      expect(first).toBe("freq");
      expect(second).toBe("prompting");
   });

   it("returns exactly 2 levers", () => {
      const answers = makeAnswers();
      const levers = calculateLevers(answers);
      expect(levers).toHaveLength(2);
   });

   it("picks last dimensions when they score lowest", () => {
      const answers = makeAnswers({ quality: 1, timesaving: 2 });
      const [first, second] = calculateLevers(answers);
      expect(first).toBe("quality");
      expect(second).toBe("timesaving");
   });

   it("does not return duplicate dimensions", () => {
      const answers = makeAnswers({ automation: 1, integration: 2 });
      const [first, second] = calculateLevers(answers);
      expect(first).not.toBe(second);
   });
});
