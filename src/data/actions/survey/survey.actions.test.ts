jest.mock("@/data/services/survey");

import { SurveyService } from "@/data/services/survey";

import { submitSurvey } from "./survey.actions";

const sSubmitSurvey = SurveyService.prototype.submitSurvey;
const sSubmitSurveyMock = sSubmitSurvey as jest.MockedFunction<
   typeof sSubmitSurvey
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
};

describe("submitSurvey action", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("calls SurveyService.submitSurvey and returns the result", async () => {
      sSubmitSurveyMock.mockResolvedValue(mockResult);

      const result = await submitSurvey(validInput);

      expect(result).toEqual(mockResult);
      expect(sSubmitSurveyMock).toHaveBeenCalledTimes(1);
      expect(sSubmitSurveyMock).toHaveBeenCalledWith({
         email: validInput.email,
         firstName: validInput.firstName,
         segment: validInput.segment,
         answers: validInput.answers,
      });
   });

   it("throws a Zod error for invalid email", async () => {
      const input = { ...validInput, email: "not-an-email" };
      await expect(submitSurvey(input)).rejects.toThrow();
      expect(sSubmitSurveyMock).not.toHaveBeenCalled();
   });

   it("throws a Zod error for invalid answer score", async () => {
      const input = {
         ...validInput,
         answers: { ...validInput.answers, freq: 5 },
      };
      await expect(submitSurvey(input)).rejects.toThrow();
      expect(sSubmitSurveyMock).not.toHaveBeenCalled();
   });

   it("throws a Zod error for invalid segment", async () => {
      const input = { ...validInput, segment: "unknown" };
      await expect(submitSurvey(input)).rejects.toThrow();
      expect(sSubmitSurveyMock).not.toHaveBeenCalled();
   });

   it("logs and re-throws service errors", async () => {
      const error = new Error("service error");
      sSubmitSurveyMock.mockRejectedValue(error);

      await expect(submitSurvey(validInput)).rejects.toThrow("service error");
      expect(console.error).toHaveBeenCalledTimes(1);
   });
});
