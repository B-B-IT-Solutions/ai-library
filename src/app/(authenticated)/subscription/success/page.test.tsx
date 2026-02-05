import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, renderAsyncRSC } from "@tests";
import { Metadata } from "next";

import SubscriptionSuccessPage, { metadata } from "./page";

const expectedMetadata: Metadata = {
   title: "Subscription Success",
};

const assertRendered = () => {
   const page = screen.getByTestId("subscription-success-page");
   const promptsLink = screen.getByTestId("prompts-link");
   const subscriptionLink = screen.getByTestId("subscription-link");

   assertInDocument(page);
   assertInDocument(promptsLink);
   assertInDocument(subscriptionLink);
};

describe("SubscriptionSuccessPage rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("SubscriptionSuccessPage - rendered - test", async () => {
      const { container } = await renderAsyncRSC(SubscriptionSuccessPage, {});

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("SubscriptionSuccessPage functionality tests", () => {
   it("SubscriptionSuccessPage - metadata - test", async () => {
      expect(metadata).toEqual(expectedMetadata);
   });
});
