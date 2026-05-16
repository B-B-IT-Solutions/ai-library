import { screen, fireEvent, waitFor } from "@testing-library/react";
import {
   assertInDocument,
   assertNotInDocument,
   renderWithRouter,
} from "@tests";

import { TrialBanner } from "./trial-banner";

describe("TrialBanner rendering tests", () => {
   it("renders banner with correct day count (plural) - test", () => {
      renderWithRouter(<TrialBanner daysLeft={7} />);

      const banner = screen.getByTestId("trial-banner");
      assertInDocument(banner);
      expect(banner.textContent).toContain("7");
      expect(banner.textContent).toContain("Tage");
   });

   it("renders banner with singular 'Tag' for 1 day - test", () => {
      renderWithRouter(<TrialBanner daysLeft={1} />);

      const banner = screen.getByTestId("trial-banner");
      expect(banner.textContent).toContain("1");
      expect(banner.textContent).toContain("Tag");
      expect(banner.textContent).not.toContain("Tage");
   });

   it("renders special message for 0 days left - test", () => {
      renderWithRouter(<TrialBanner daysLeft={0} />);

      const banner = screen.getByTestId("trial-banner");
      expect(banner.textContent).toContain("heute");
   });

   it("CTA link points to /subscription/pricing - test", () => {
      renderWithRouter(<TrialBanner daysLeft={5} />);

      const cta = screen.getByTestId("trial-banner-cta");
      assertInDocument(cta);
      expect(cta).toHaveAttribute("href", "/subscription/pricing");
   });

   it("dismisses banner when X button clicked - test", async () => {
      renderWithRouter(<TrialBanner daysLeft={5} />);

      const dismissBtn = screen.getByTestId("trial-banner-dismiss");
      assertInDocument(dismissBtn);

      fireEvent.click(dismissBtn);

      await waitFor(() => {
         assertNotInDocument(screen.queryByTestId("trial-banner"));
      });
   });

   it("applies urgent (orange) styling when daysLeft <= 3 - test", () => {
      renderWithRouter(<TrialBanner daysLeft={3} />);

      const banner = screen.getByTestId("trial-banner");
      // Orange styling class should be present
      expect(banner.className).toContain("orange");
   });

   it("applies normal (blue) styling when daysLeft > 3 - test", () => {
      renderWithRouter(<TrialBanner daysLeft={10} />);

      const banner = screen.getByTestId("trial-banner");
      // Blue styling class should be present
      expect(banner.className).toContain("blue");
   });

   it("applies urgent styling for exactly 1 day remaining - test", () => {
      renderWithRouter(<TrialBanner daysLeft={1} />);

      const banner = screen.getByTestId("trial-banner");
      expect(banner.className).toContain("orange");
   });

   it("applies normal styling for exactly 4 days remaining - test", () => {
      renderWithRouter(<TrialBanner daysLeft={4} />);

      const banner = screen.getByTestId("trial-banner");
      expect(banner.className).toContain("blue");
   });
});
