import { render, screen } from "@testing-library/react";

import KiReadinessCheckPage from "./page";

jest.mock("@/components/funnel/survey/SurveyContainer", () => ({
   SurveyContainer: () => <div data-testid="survey-container-mock" />,
}));

describe("KiReadinessCheckPage", () => {
   it("renders the SurveyContainer", () => {
      render(<KiReadinessCheckPage />);
      expect(screen.getByTestId("survey-container-mock")).toBeInTheDocument();
   });
});
