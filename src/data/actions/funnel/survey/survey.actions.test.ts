jest.mock("@/data/services/funnel/survey");

import { SurveyService } from "@/data/services/funnel/survey";

import { getSurveyQuestions, getSurveySegmentLabels, submitSurvey } from "./survey.actions";

const sSubmitSurvey = SurveyService.prototype.submitSurvey as jest.MockedFunction<
   typeof SurveyService.prototype.submitSurvey
>;
const sGetSegmentLabels = SurveyService.prototype.getSegmentLabels as jest.MockedFunction<
   typeof SurveyService.prototype.getSegmentLabels
>;
const sGetQuestionsForSegment =
   SurveyService.prototype.getQuestionsForSegment as jest.MockedFunction<
      typeof SurveyService.prototype.getQuestionsForSegment
   >;

const validInput = {
   email: "test@example.com",
   firstName: "Max",
   segment: "solo" as const,
   answers: {
      freq: 3 as const,
      prompting: 2 as const,
      tooling: 4 as const,
      files: 1 as const,
      automation: 2 as const,
      integration: 3 as const,
      quality: 4 as const,
      timesaving: 2 as const,
   },
};

const mockResult = {
   stage: 2 as const,
   total: 21,
   levers: ["freq", "files"] as ["freq", "files"],
   stageLabel: "KI-Anwender",
   stageEmoji: "🚀",
   stageText: "Du nutzt KI bereits im Alltag.",
   ctaText: "Mehr rausholen →",
   ctaHref: "/explore",
   leverTexts: ["Routine aufbauen", "Prompts verbessern"] as [string, string],
};

describe("submitSurvey action", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("calls SurveyService.submitSurvey and returns success result", async () => {
      sSubmitSurvey.mockResolvedValue(mockResult);

      const result = await submitSurvey(validInput);

      expect(result).toEqual({ success: true, message: "Umfrage erfolgreich eingereicht", data: mockResult });
      expect(sSubmitSurvey).toHaveBeenCalledTimes(1);
      expect(sSubmitSurvey).toHaveBeenCalledWith({
         email: validInput.email,
         firstName: validInput.firstName,
         segment: validInput.segment,
         answers: validInput.answers,
      });
   });

   it("returns failure for invalid email", async () => {
      const input = { ...validInput, email: "not-an-email" };
      const result = await submitSurvey(input);

      expect(result).toEqual({ success: false, message: "Fehler beim Einreichen der Umfrage" });
      expect(sSubmitSurvey).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("returns failure for invalid answer score", async () => {
      const input = { ...validInput, answers: { ...validInput.answers, freq: 5 as never } };
      const result = await submitSurvey(input);

      expect(result).toEqual({ success: false, message: "Fehler beim Einreichen der Umfrage" });
      expect(sSubmitSurvey).not.toHaveBeenCalled();
   });

   it("returns failure for invalid segment", async () => {
      const input = { ...validInput, segment: "unknown" as never };
      const result = await submitSurvey(input);

      expect(result).toEqual({ success: false, message: "Fehler beim Einreichen der Umfrage" });
      expect(sSubmitSurvey).not.toHaveBeenCalled();
   });

   it("logs and returns failure on service errors", async () => {
      const error = new Error("service error");
      sSubmitSurvey.mockRejectedValue(error);

      const result = await submitSurvey(validInput);

      expect(result).toEqual({ success: false, message: "Fehler beim Einreichen der Umfrage" });
      expect(console.error).toHaveBeenCalledTimes(1);
   });
});

describe("getSurveySegmentLabels action", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("returns segment labels from the service", async () => {
      const labels = { solo: "Solo", employee: "Employee", coach: "Coach", default: "Default" };
      sGetSegmentLabels.mockReturnValue(labels);

      const result = await getSurveySegmentLabels();
      expect(result).toEqual(labels);
      expect(sGetSegmentLabels).toHaveBeenCalledTimes(1);
   });

   it("returns empty object and logs on service error", async () => {
      sGetSegmentLabels.mockImplementation(() => { throw new Error("service error"); });

      const result = await getSurveySegmentLabels();
      expect(result).toEqual({});
      expect(console.error).toHaveBeenCalledTimes(1);
   });
});

describe("getSurveyQuestions action", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("returns questions for the given segment", async () => {
      const mockQuestions = [{ id: "freq", text: "Q", answers: [] as never }] as never;
      sGetQuestionsForSegment.mockReturnValue(mockQuestions);

      const result = await getSurveyQuestions("solo");
      expect(result).toEqual(mockQuestions);
      expect(sGetQuestionsForSegment).toHaveBeenCalledWith("solo");
   });

   it("returns empty array and logs for invalid segment", async () => {
      const result = await getSurveyQuestions("invalid" as never);
      expect(result).toEqual([]);
      expect(sGetQuestionsForSegment).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
   });
});
