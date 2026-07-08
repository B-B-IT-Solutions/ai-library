jest.mock("@/data/actions/funnel/survey");
jest.mock("./AnalysisLoader", () => ({
   AnalysisLoader: ({ onDone }: { onDone: () => void }) => {
      setTimeout(onDone, 0);
      return <div data-testid="analysis-loader" />;
   },
}));

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { submitSurvey } from "@/data/actions/funnel/survey";

import { SurveyContainer } from "./SurveyContainer";

const submitSurveyMock = submitSurvey as jest.MockedFunction<
   typeof submitSurvey
>;

const DIMENSIONS = [
   "freq",
   "prompting",
   "tooling",
   "files",
   "automation",
   "integration",
   "quality",
   "timesaving",
] as const;

const mockQuestions = DIMENSIONS.map((id) => ({
   id,
   text: `Question ${id}`,
   answers: [
      { score: 1 as const, label: "Option 1" },
      { score: 2 as const, label: "Option 2" },
      { score: 3 as const, label: "Option 3" },
      { score: 4 as const, label: "Option 4" },
   ] as [
      { score: 1; label: string },
      { score: 2; label: string },
      { score: 3; label: string },
      { score: 4; label: string },
   ],
}));

const mockSegmentLabels = {
   solo: "Ich führe mein eigenes Unternehmen",
   employee: "Ich bin angestellt",
   coach: "Ich berate andere",
   default: "Etwas anderes",
};

const mockQuestionsBySegment = {
   solo: mockQuestions,
   employee: mockQuestions,
   coach: mockQuestions,
   default: mockQuestions,
};

const mockResult = {
   stage: 2 as const,
   total: 17,
   levers: ["freq", "prompting"] as ["freq", "prompting"],
   stageLabel: "KI-Anwender",
   stageEmoji: "🚀",
   stageText: "Du nutzt KI bereits im Alltag.",
   ctaText: "Zeig mir mehr →",
   ctaHref: "/explore",
   leverTexts: [
      "Baue dir eine feste Routine auf",
      "Nutze konkrete Prompts",
   ] as [string, string],
};

const renderContainer = () =>
   render(
      <SurveyContainer
         segments={mockSegmentLabels}
         questionsBySegment={mockQuestionsBySegment}
      />
   );

describe("SurveyContainer", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      submitSurveyMock.mockResolvedValue({
         success: true,
         message: "Umfrage erfolgreich eingereicht",
         data: mockResult,
      });
   });

   it("renders intro screen initially", () => {
      renderContainer();
      expect(screen.getByTestId("intro-screen")).toBeInTheDocument();
   });

   it("advances to segment step after clicking start", async () => {
      renderContainer();
      await userEvent.click(screen.getByTestId("intro-start-button"));
      expect(screen.getByTestId("segment-step")).toBeInTheDocument();
   });

   it("advances to first question after selecting a segment", async () => {
      renderContainer();
      await userEvent.click(screen.getByTestId("intro-start-button"));
      await userEvent.click(screen.getByTestId("segment-option-solo"));
      expect(screen.getByTestId("question-step")).toBeInTheDocument();
      expect(screen.getByText("Frage 1 von 8")).toBeInTheDocument();
   });

   it("goes back to previous question when Zurück is clicked", async () => {
      renderContainer();
      await userEvent.click(screen.getByTestId("intro-start-button"));
      await userEvent.click(screen.getByTestId("segment-option-solo"));
      await userEvent.click(screen.getByTestId("answer-option-3"));
      expect(screen.getByText("Frage 2 von 8")).toBeInTheDocument();
      await userEvent.click(screen.getByTestId("back-button"));
      expect(screen.getByText("Frage 1 von 8")).toBeInTheDocument();
   });

   it("shows analysis loader after answering all 8 questions", async () => {
      renderContainer();
      await userEvent.click(screen.getByTestId("intro-start-button"));
      await userEvent.click(screen.getByTestId("segment-option-employee"));
      for (let i = 0; i < 8; i++) {
         await userEvent.click(screen.getByTestId("answer-option-2"));
      }
      expect(screen.getByTestId("analysis-loader")).toBeInTheDocument();
   });

   it("shows email gate after analysis loader completes", async () => {
      renderContainer();
      await userEvent.click(screen.getByTestId("intro-start-button"));
      await userEvent.click(screen.getByTestId("segment-option-solo"));
      for (let i = 0; i < 8; i++) {
         await userEvent.click(screen.getByTestId("answer-option-3"));
      }
      await waitFor(() => {
         expect(screen.getByTestId("email-gate-step")).toBeInTheDocument();
      });
   });

   it("shows result screen after successful survey submission", async () => {
      renderContainer();
      await userEvent.click(screen.getByTestId("intro-start-button"));
      await userEvent.click(screen.getByTestId("segment-option-solo"));
      for (let i = 0; i < 8; i++) {
         await userEvent.click(screen.getByTestId("answer-option-3"));
      }
      await waitFor(() => {
         expect(screen.getByTestId("email-gate-step")).toBeInTheDocument();
      });

      await userEvent.type(
         screen.getByTestId("email-input"),
         "test@example.com"
      );
      await userEvent.click(screen.getByTestId("consent-checkbox"));
      await userEvent.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
         expect(screen.getByTestId("result-screen")).toBeInTheDocument();
      });
      expect(submitSurveyMock).toHaveBeenCalledTimes(1);
   });

   it("shows an error toast and stays on the email step when submission fails", async () => {
      submitSurveyMock.mockResolvedValue({
         success: false,
         message: "Fehler beim Einreichen der Umfrage",
      });

      renderContainer();
      await userEvent.click(screen.getByTestId("intro-start-button"));
      await userEvent.click(screen.getByTestId("segment-option-solo"));
      for (let i = 0; i < 8; i++) {
         await userEvent.click(screen.getByTestId("answer-option-3"));
      }
      await waitFor(() => {
         expect(screen.getByTestId("email-gate-step")).toBeInTheDocument();
      });

      await userEvent.type(
         screen.getByTestId("email-input"),
         "test@example.com"
      );
      await userEvent.click(screen.getByTestId("consent-checkbox"));
      await userEvent.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
         expect(submitSurveyMock).toHaveBeenCalledTimes(1);
      });
      expect(screen.getByTestId("email-gate-step")).toBeInTheDocument();
   });

   it("resets to intro screen when restart is clicked", async () => {
      renderContainer();
      await userEvent.click(screen.getByTestId("intro-start-button"));
      await userEvent.click(screen.getByTestId("segment-option-solo"));
      for (let i = 0; i < 8; i++) {
         await userEvent.click(screen.getByTestId("answer-option-3"));
      }
      await waitFor(() =>
         expect(screen.getByTestId("email-gate-step")).toBeInTheDocument()
      );

      await userEvent.type(
         screen.getByTestId("email-input"),
         "test@example.com"
      );
      await userEvent.click(screen.getByTestId("consent-checkbox"));
      await userEvent.click(screen.getByTestId("submit-button"));
      await waitFor(() =>
         expect(screen.getByTestId("result-screen")).toBeInTheDocument()
      );

      await userEvent.click(screen.getByTestId("restart-button"));
      expect(screen.getByTestId("intro-screen")).toBeInTheDocument();
   });
});
