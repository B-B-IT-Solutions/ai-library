import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, renderAsyncRSC } from "@tests";
import { Metadata } from "next";

import { metadata, SubscriptionSuccessPage } from "./page";

const expectedMetadata: Metadata = {
   title: "Subscription Success",
};

const assertRendered = () => {
   const page = screen.getByTestId("subscription-success-page");
   const confirmation = screen.getByTestId("subscription-confirmation");

   assertInDocument(page);
   assertInDocument(confirmation);
};

describe("SubscriptionSuccessPage rendering tests", () => {
   it("rendered - test", async () => {
      const { container } = await renderAsyncRSC(SubscriptionSuccessPage, {});

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("SubscriptionSuccessPage functionality tests", () => {
   it("metadata - test", async () => {
      expect(metadata).toEqual(expectedMetadata);
   });
});
