import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
   assertHasAttributeWithValue,
   assertInDocument,
   assertNotInDocument,
   renderWithRouter,
} from "@tests";

import { TrialBanner } from "./trial-banner";

const assertBannerRendered = () => {
   const banner = screen.getByTestId("trial-banner");
   const link = screen.getByTestId("subcription-link");
   const dismissBtn = screen.getByTestId("dismiss-btn");

   assertInDocument(banner);
   assertInDocument(link);
   assertInDocument(dismissBtn);

   assertHasAttributeWithValue(link, "href", "/subscription/pricing");
};

const assertBannerNotRendered = () => {
   const banner = screen.queryByTestId("trial-banner");
   assertNotInDocument(banner);
};

describe("TrialBanner rendering tests", () => {
   it("daysleft 7 - dissmissed false - test ", async () => {
      const { container } = renderWithRouter(<TrialBanner daysLeft={7} />);

      await waitFor(() => {
         assertBannerRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("daysleft 1 - dissmissed false - test ", async () => {
      const { container } = renderWithRouter(<TrialBanner daysLeft={1} />);

      await waitFor(() => {
         assertBannerRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("daysleft 0 - dissmissed false - test ", async () => {
      const { container } = renderWithRouter(<TrialBanner daysLeft={0} />);

      await waitFor(() => {
         assertBannerRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("TrialBanner functionality tests", () => {
   it("dissmiss btn clicked  - test", async () => {
      renderWithRouter(<TrialBanner daysLeft={5} />);

      await waitFor(() => {
         assertBannerRendered();
      });

      const dismissBtn = screen.getByTestId("dismiss-btn");
      assertInDocument(dismissBtn);

      userEvent.click(dismissBtn);

      await waitFor(() => {
         assertBannerNotRendered();
      });
   });
});
