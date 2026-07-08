import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { QuestionStep } from "./QuestionStep";
import type { Question } from "@/data/services/survey/survey-data";

const mockQuestion: Question = {
   id: "freq",
   text: "Wie oft nutzt du KI?",
   answers: [
      { score: 1, label: "Nie" },
      { score: 2, label: "Manchmal" },
      { score: 3, label: "Oft" },
      { score: 4, label: "Täglich" },
   ],
};

describe("QuestionStep", () => {
   const onAnswer = jest.fn();
   const onBack = jest.fn();

   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("renders the question text", () => {
      render(
         <QuestionStep
            question={mockQuestion}
            questionIndex={0}
            totalQuestions={8}
            currentAnswer={undefined}
            onAnswer={onAnswer}
            onBack={onBack}
         />
      );
      expect(screen.getByText("Wie oft nutzt du KI?")).toBeInTheDocument();
   });

   it("renders all 4 answer options", () => {
      render(
         <QuestionStep
            question={mockQuestion}
            questionIndex={0}
            totalQuestions={8}
            currentAnswer={undefined}
            onAnswer={onAnswer}
            onBack={onBack}
         />
      );
      expect(screen.getByTestId("answer-option-1")).toBeInTheDocument();
      expect(screen.getByTestId("answer-option-2")).toBeInTheDocument();
      expect(screen.getByTestId("answer-option-3")).toBeInTheDocument();
      expect(screen.getByTestId("answer-option-4")).toBeInTheDocument();
   });

   it("calls onAnswer with correct score when an option is clicked", async () => {
      render(
         <QuestionStep
            question={mockQuestion}
            questionIndex={0}
            totalQuestions={8}
            currentAnswer={undefined}
            onAnswer={onAnswer}
            onBack={onBack}
         />
      );
      await userEvent.click(screen.getByTestId("answer-option-3"));
      expect(onAnswer).toHaveBeenCalledWith(3);
   });

   it("marks the current answer as selected", () => {
      render(
         <QuestionStep
            question={mockQuestion}
            questionIndex={2}
            totalQuestions={8}
            currentAnswer={2}
            onAnswer={onAnswer}
            onBack={onBack}
         />
      );
      const selected = screen.getByTestId("answer-option-2");
      expect(selected).toHaveClass("border-blue-500");
   });

   it("calls onBack when Zurück is clicked", async () => {
      render(
         <QuestionStep
            question={mockQuestion}
            questionIndex={1}
            totalQuestions={8}
            currentAnswer={undefined}
            onAnswer={onAnswer}
            onBack={onBack}
         />
      );
      await userEvent.click(screen.getByTestId("back-button"));
      expect(onBack).toHaveBeenCalledTimes(1);
   });

   it("shows correct progress (Frage 3 von 8)", () => {
      render(
         <QuestionStep
            question={mockQuestion}
            questionIndex={2}
            totalQuestions={8}
            currentAnswer={undefined}
            onAnswer={onAnswer}
            onBack={onBack}
         />
      );
      expect(screen.getByText("Frage 3 von 8")).toBeInTheDocument();
   });
});
