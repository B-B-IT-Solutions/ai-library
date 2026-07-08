jest.mock("@/data/actions/funnel/survey");
jest.mock("./SurveyContainer", () => ({
   SurveyContainer: jest.fn(() => <div data-testid="survey-container-mock" />),
}));

import { screen } from "@testing-library/react";
import { renderAsyncRSC } from "@tests";

import {
   getSurveyQuestions,
   getSurveySegments,
} from "@/data/actions/funnel/survey";
import { DSurveyQuestion } from "@/data/types/domain/funnel/survey";

import { SurveyMain } from "./survey-main";
import { SurveyContainer } from "./SurveyContainer";

const getSurveySegmentsMock = getSurveySegments as jest.MockedFunction<
   typeof getSurveySegments
>;
const getSurveyQuestionsMock = getSurveyQuestions as jest.MockedFunction<
   typeof getSurveyQuestions
>;
const SurveyContainerMock = SurveyContainer as jest.MockedFunction<
   typeof SurveyContainer
>;

const mockSegmentLabels = {
   solo: "Ich führe mein eigenes Unternehmen",
   employee: "Ich bin angestellt",
   coach: "Ich berate andere",
   default: "Etwas anderes",
};

const questionsFor = (segment: string): DSurveyQuestion[] => [
   {
      id: "freq",
      text: `Question for ${segment}`,
      answers: [
         { score: 1, label: "Option 1" },
         { score: 2, label: "Option 2" },
         { score: 3, label: "Option 3" },
         { score: 4, label: "Option 4" },
      ],
   },
];

describe("SurveyMain", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      getSurveySegmentsMock.mockResolvedValue(mockSegmentLabels);
      getSurveyQuestionsMock.mockImplementation((segment) =>
         Promise.resolve(questionsFor(segment))
      );
   });

   it("renders the SurveyContainer", async () => {
      await renderAsyncRSC(SurveyMain, {});
      expect(screen.getByTestId("survey-container-mock")).toBeInTheDocument();
   });

   it("fetches segment labels and questions for every segment", async () => {
      await renderAsyncRSC(SurveyMain, {});

      expect(getSurveySegmentsMock).toHaveBeenCalledTimes(1);
      expect(getSurveyQuestionsMock).toHaveBeenCalledTimes(4);
      (
         Object.keys(mockSegmentLabels) as (keyof typeof mockSegmentLabels)[]
      ).forEach((segment) => {
         expect(getSurveyQuestionsMock).toHaveBeenCalledWith(segment);
      });
   });

   it("passes segments and questionsBySegment down to SurveyContainer", async () => {
      await renderAsyncRSC(SurveyMain, {});

      expect(SurveyContainerMock).toHaveBeenCalledWith(
         {
            segments: mockSegmentLabels,
            questionsBySegment: {
               solo: questionsFor("solo"),
               employee: questionsFor("employee"),
               coach: questionsFor("coach"),
               default: questionsFor("default"),
            },
         },
         undefined
      );
   });
});
