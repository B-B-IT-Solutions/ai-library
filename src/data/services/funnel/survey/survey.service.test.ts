import { mock, mockReset } from "jest-mock-extended";

import type { SurveyRepository } from "@/data/repositories/funnel/survey";
import { DSurveyAnswers } from "@/data/types/domain/funnel/survey";

import { SurveyService } from "./survey.service";
import { LEVER_TEXTS, STAGE_RESULTS } from "./survey-results";

const surveyRepoMock = mock<SurveyRepository>();
const surveyService = new SurveyService(surveyRepoMock);

const makeAnswers = (score: 1 | 2 | 3 | 4 = 3): DSurveyAnswers => ({
   freq: score,
   prompting: score,
   tooling: score,
   files: score,
   automation: score,
   integration: score,
   quality: score,
   timesaving: score,
});

describe("SurveyService.submitSurvey", () => {
   beforeEach(() => {
      mockReset(surveyRepoMock);
      surveyRepoMock.pCreate.mockResolvedValue({} as never);
   });

   it("calculates total as sum of all answer scores", async () => {
      const answers = makeAnswers(3); // 8 * 3 = 24
      await surveyService.submitSurvey({
         email: "test@example.com",
         segment: "solo",
         answers,
      });
      expect(surveyRepoMock.pCreate).toHaveBeenCalledWith(
         expect.objectContaining({ total: 24 })
      );
   });

   it("derives stage 1 for low total (≤14)", async () => {
      const answers = makeAnswers(1); // 8 * 1 = 8
      const result = await surveyService.submitSurvey({
         email: "test@example.com",
         segment: "default",
         answers,
      });
      expect(result.stage).toBe(1);
   });

   it("derives stage 2 for total 15–20", async () => {
      const answers: DSurveyAnswers = {
         ...makeAnswers(2),
         freq: 3,
         prompting: 3,
      };
      const result = await surveyService.submitSurvey({
         email: "test@example.com",
         segment: "employee",
         answers,
      });
      expect(result.stage).toBe(2);
   });

   it("derives stage 3 for total 21–26", async () => {
      const answers = makeAnswers(3); // 24
      const result = await surveyService.submitSurvey({
         email: "test@example.com",
         segment: "coach",
         answers,
      });
      expect(result.stage).toBe(3);
   });

   it("derives stage 4 for total ≥27", async () => {
      const answers = makeAnswers(4); // 32
      const result = await surveyService.submitSurvey({
         email: "test@example.com",
         segment: "solo",
         answers,
      });
      expect(result.stage).toBe(4);
   });

   it("returns 2 levers (lowest-scoring dimensions)", async () => {
      const answers: DSurveyAnswers = {
         ...makeAnswers(4),
         freq: 1,
         prompting: 2,
      };
      const result = await surveyService.submitSurvey({
         email: "test@example.com",
         segment: "solo",
         answers,
      });
      expect(result.levers[0]).toBe("freq");
      expect(result.levers[1]).toBe("prompting");
   });

   it("includes stageLabel, stageEmoji, stageText, ctaText, ctaHref from STAGE_RESULTS", async () => {
      const answers = makeAnswers(1); // stage 1
      const result = await surveyService.submitSurvey({
         email: "test@example.com",
         segment: "solo",
         answers,
      });
      const expected = STAGE_RESULTS[1];
      expect(result.stageLabel).toBe(expected.label);
      expect(result.stageEmoji).toBe(expected.emoji);
      expect(result.stageText).toBe(expected.text);
      expect(result.ctaText).toBe(expected.ctaText);
      expect(result.ctaHref).toBe(expected.ctaHref);
   });

   it("includes leverTexts matching the segment and lowest dimensions", async () => {
      const answers: DSurveyAnswers = {
         ...makeAnswers(4),
         freq: 1,
         prompting: 2,
      };
      const result = await surveyService.submitSurvey({
         email: "test@example.com",
         segment: "solo",
         answers,
      });
      expect(result.leverTexts[0]).toBe(LEVER_TEXTS.freq.solo);
      expect(result.leverTexts[1]).toBe(LEVER_TEXTS.prompting.solo);
   });

   it("saves submission via repository with correct data", async () => {
      const answers = makeAnswers(2);
      await surveyService.submitSurvey({
         email: "user@example.com",
         firstName: "Anna",
         segment: "coach",
         answers,
      });
      expect(surveyRepoMock.pCreate).toHaveBeenCalledTimes(1);
      expect(surveyRepoMock.pCreate).toHaveBeenCalledWith(
         expect.objectContaining({
            email: "user@example.com",
            firstName: "Anna",
            segment: "coach",
            answers,
         })
      );
   });

   it("sets firstName to null when not provided", async () => {
      await surveyService.submitSurvey({
         email: "test@example.com",
         segment: "solo",
         answers: makeAnswers(),
      });
      expect(surveyRepoMock.pCreate).toHaveBeenCalledWith(
         expect.objectContaining({ firstName: null })
      );
   });

   it("propagates repository errors", async () => {
      surveyRepoMock.pCreate.mockRejectedValue(new Error("DB error"));
      await expect(
         surveyService.submitSurvey({
            email: "test@example.com",
            segment: "solo",
            answers: makeAnswers(),
         })
      ).rejects.toThrow("DB error");
   });
});
