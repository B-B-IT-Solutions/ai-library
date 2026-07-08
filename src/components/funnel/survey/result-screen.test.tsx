import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ResultScreen } from "./result-screen";

describe("ResultScreen", () => {
   const onRestart = jest.fn();
   const defaultProps = {
      stage: 2 as const,
      total: 17,
      stageLabel: "KI-Anwender",
      stageEmoji: "🚀",
      stageText: "Du nutzt KI bereits im Alltag — aber eher punktuell.",
      ctaText: "Zeig mir, wie ich mehr rausholen kann →",
      ctaHref: "/explore",
      leverTexts: [
         "Baue dir eine feste Routine auf",
         "Nutze konkrete Prompts mit Kontext",
      ] as [string, string],
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
      expect(screen.getByTestId("result-score")).toHaveTextContent(
         "Dein Score: 17/32"
      );
   });

   it("renders result text for the given stage", () => {
      render(<ResultScreen {...defaultProps} />);
      expect(screen.getByTestId("result-text")).toHaveTextContent(
         "Du nutzt KI bereits im Alltag"
      );
   });

   it("renders 2 lever items", () => {
      render(<ResultScreen {...defaultProps} />);
      const levers = screen.getByTestId("levers-list").querySelectorAll("li");
      expect(levers).toHaveLength(2);
   });

   it("renders lever texts", () => {
      render(<ResultScreen {...defaultProps} />);
      expect(
         screen.getByText("Baue dir eine feste Routine auf")
      ).toBeInTheDocument();
      expect(
         screen.getByText("Nutze konkrete Prompts mit Kontext")
      ).toBeInTheDocument();
   });

   it("renders CTA button with correct text and link", () => {
      render(<ResultScreen {...defaultProps} />);
      const cta = screen.getByTestId("cta-button");
      expect(cta).toBeInTheDocument();
      expect(cta).toHaveTextContent("Zeig mir, wie ich mehr rausholen kann →");
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
            stageLabel="KI-Neuling"
            stageEmoji="🌱"
            stageText="Du stehst noch ganz am Anfang."
            ctaText="Zeig mir den Einstieg →"
            ctaHref="/explore"
            leverTexts={["Lever A", "Lever B"]}
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
            stageLabel="KI-Profi / Automatisierer"
            stageEmoji="🏆"
            stageText="Du gehörst zu den Top-Anwendern."
            ctaText="Sprich mit mir →"
            ctaHref="/explore"
            leverTexts={["Lever X", "Lever Y"]}
            onRestart={onRestart}
         />
      );
      expect(screen.getByText("KI-Profi / Automatisierer")).toBeInTheDocument();
      expect(screen.getByText("🏆")).toBeInTheDocument();
   });
});
