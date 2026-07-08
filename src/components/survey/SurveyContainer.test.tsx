jest.mock("@/data/actions/survey");

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { submitSurvey } from "@/data/actions/survey";

import { SurveyContainer } from "./SurveyContainer";

const submitSurveyMock = submitSurvey as jest.MockedFunction<typeof submitSurvey>;

const mockResult = {
   stage: 2 as const,
   total: 17,
   levers: ["freq", "prompting"] as ["freq", "prompting"],
};

describe("SurveyContainer", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      submitSurveyMock.mockResolvedValue(mockResult);
   });

   it("renders intro screen initially", () => {
      render(<SurveyContainer />);
      expect(screen.getByTestId("intro-screen")).toBeInTheDocument();
   });

   it("advances to segment step after clicking start", async () => {
      render(<SurveyContainer />);
      await userEvent.click(screen.getByTestId("intro-start-button"));
      expect(screen.getByTestId("segment-step")).toBeInTheDocument();
   });

   it("advances to first question after selecting a segment", async () => {
      render(<SurveyContainer />);
      await userEvent.click(screen.getByTestId("intro-start-button"));
      await userEvent.click(screen.getByTestId("segment-option-solo"));
      expect(screen.getByTestId("question-step")).toBeInTheDocument();
      expect(screen.getByText("Frage 1 von 8")).toBeInTheDocument();
   });

   it("goes back to previous question when Zurück is clicked", async () => {
      render(<SurveyContainer />);
      await userEvent.click(screen.getByTestId("intro-start-button"));
      await userEvent.click(screen.getByTestId("segment-option-solo"));
      await userEvent.click(screen.getByTestId("answer-option-3"));
      expect(screen.getByText("Frage 2 von 8")).toBeInTheDocument();
      await userEvent.click(screen.getByTestId("back-button"));
      expect(screen.getByText("Frage 1 von 8")).toBeInTheDocument();
   });

   it("shows analysis loader after answering all 8 questions", async () => {
      render(<SurveyContainer />);
      await userEvent.click(screen.getByTestId("intro-start-button"));
      await userEvent.click(screen.getByTestId("segment-option-employee"));
      for (let i = 0; i < 8; i++) {
         await userEvent.click(screen.getByTestId("answer-option-2"));
      }
      expect(screen.getByTestId("analysis-loader")).toBeInTheDocument();
   });

   it("shows email gate after analysis loader completes", async () => {
      jest.useFakeTimers();
      render(<SurveyContainer />);
      await userEvent.click(screen.getByTestId("intro-start-button"));
      await userEvent.click(screen.getByTestId("segment-option-solo"));
      for (let i = 0; i < 8; i++) {
         await userEvent.click(screen.getByTestId("answer-option-3"));
      }
      expect(screen.getByTestId("analysis-loader")).toBeInTheDocument();
      jest.advanceTimersByTime(1500);
      await waitFor(() => {
         expect(screen.getByTestId("email-gate-step")).toBeInTheDocument();
      });
      jest.useRealTimers();
   });

   it("shows result screen after successful survey submission", async () => {
      jest.useFakeTimers();
      render(<SurveyContainer />);
      await userEvent.click(screen.getByTestId("intro-start-button"));
      await userEvent.click(screen.getByTestId("segment-option-solo"));
      for (let i = 0; i < 8; i++) {
         await userEvent.click(screen.getByTestId("answer-option-3"));
      }
      jest.advanceTimersByTime(1500);
      await waitFor(() => {
         expect(screen.getByTestId("email-gate-step")).toBeInTheDocument();
      });
      jest.useRealTimers();

      await userEvent.type(screen.getByTestId("email-input"), "test@example.com");
      await userEvent.click(screen.getByTestId("consent-checkbox"));
      await userEvent.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
         expect(screen.getByTestId("result-screen")).toBeInTheDocument();
      });
      expect(submitSurveyMock).toHaveBeenCalledTimes(1);
   });

   it("resets to intro screen when restart is clicked", async () => {
      jest.useFakeTimers();
      render(<SurveyContainer />);
      await userEvent.click(screen.getByTestId("intro-start-button"));
      await userEvent.click(screen.getByTestId("segment-option-solo"));
      for (let i = 0; i < 8; i++) {
         await userEvent.click(screen.getByTestId("answer-option-3"));
      }
      jest.advanceTimersByTime(1500);
      await waitFor(() =>
         expect(screen.getByTestId("email-gate-step")).toBeInTheDocument()
      );
      jest.useRealTimers();

      await userEvent.type(screen.getByTestId("email-input"), "test@example.com");
      await userEvent.click(screen.getByTestId("consent-checkbox"));
      await userEvent.click(screen.getByTestId("submit-button"));
      await waitFor(() =>
         expect(screen.getByTestId("result-screen")).toBeInTheDocument()
      );

      await userEvent.click(screen.getByTestId("restart-button"));
      expect(screen.getByTestId("intro-screen")).toBeInTheDocument();
   });
});
