jest.mock("@/components/admin/subscription-plans", () => ({
   AdminSubscriptionPlans: () => {
      return <div data-testid="admin-subscription-plans" />;
   },
}));

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, renderAsyncRSC } from "@tests";
import { Metadata } from "next";

import { AdminSubscriptionPlansPage, metadata } from "./page";

const expectedMetadata: Metadata = {
   title: "Admin – Abo-Pläne",
};

const assertRendered = () => {
   const page = screen.getByTestId("admin-subscription-plans-page");
   const plans = screen.getByTestId("admin-subscription-plans");

   assertInDocument(page);
   assertInDocument(plans);
};

describe("AdminSubscriptionPlansPage rendering tests", () => {
   it("page rendered - test", async () => {
      const { container } = await renderAsyncRSC(
         AdminSubscriptionPlansPage,
         {}
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("AdminSubscriptionPlansPage functionality tests", () => {
   it("metadata - test", async () => {
      expect(metadata).toEqual(expectedMetadata);
   });
});
