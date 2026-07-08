import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ResultScreen } from "./ResultScreen";

describe("ResultScreen", () => {
   const onRestart = jest.fn();
   const defaultProps = {
      stage: 2 as const,
      total: 17,
      levers: ["freq", "prompting"] as ["freq", "prompting"],
      segment: "solo" as const,
      onRestart,
   };

   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("renders the stage label and emoji", () => {
      render(<ResultScreen {...defaultProps} />);
      expect(screen.getByText("KI-Anwender")).toBeInTheDocument();
      expect(screen.getByText("🚀")).toBeInTheDocument();
   });

   it("displays the score", () => {
      render(<ResultScreen {...defaultProps} />);
      expect(screen.getByTestId("result-score")).toHaveTextContent("Dein Score: 17/32");
   });

   it("renders result text for the given stage", () => {
      render(<ResultScreen {...defaultProps} />);
      expect(screen.getByTestId("result-text")).toBeInTheDocument();
   });

   it("renders 2 lever items", () => {
      render(<ResultScreen {...defaultProps} />);
      const levers = screen.getByTestId("levers-list").querySelectorAll("li");
      expect(levers).toHaveLength(2);
   });

   it("renders lever texts for correct segment", () => {
      render(<ResultScreen {...defaultProps} />);
      // freq lever text for solo segment
      expect(
         screen.getByText(/feste Routine.*Business-Aufgabe/i)
      ).toBeInTheDocument();
   });

   it("renders CTA button", () => {
      render(<ResultScreen {...defaultProps} />);
      expect(screen.getByTestId("cta-button")).toBeInTheDocument();
   });

   it("calls onRestart when restart button is clicked", async () => {
      render(<ResultScreen {...defaultProps} />);
      await userEvent.click(screen.getByTestId("restart-button"));
      expect(onRestart).toHaveBeenCalledTimes(1);
   });

   it("renders correctly for stage 1", () => {
      render(
         <ResultScreen
            stage={1}
            total={10}
            levers={["automation", "integration"]}
            segment="employee"
            onRestart={onRestart}
         />
      );
      expect(screen.getByText("KI-Neuling")).toBeInTheDocument();
      expect(screen.getByText("🌱")).toBeInTheDocument();
      expect(screen.getByTestId("result-score")).toHaveTextContent("10/32");
   });

   it("renders correctly for stage 4", () => {
      render(
         <ResultScreen
            stage={4}
            total={30}
            levers={["quality", "timesaving"]}
            segment="coach"
            onRestart={onRestart}
         />
      );
      expect(screen.getByText("KI-Profi / Automatisierer")).toBeInTheDocument();
      expect(screen.getByText("🏆")).toBeInTheDocument();
   });
});
