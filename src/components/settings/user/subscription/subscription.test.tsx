jest.mock("@/data/actions/subscription");

import { assertInDocument, dtestData, renderAsyncRSC } from "@tests";

import { getSubscription } from "@/data/actions/subscription";

const getUserSubscriptionMock = getSubscription as jest.MockedFunction<
   typeof getSubscription
>;

import { screen, waitFor } from "@testing-library/dom";

import { Subscription } from "./subscription";

const assertRendered = () => {
   const subscription = screen.getByTestId("subscription");
   const status = screen.getByTestId("subscription-paid-plan");

   assertInDocument(subscription);
   assertInDocument(status);
};

describe("SettingsPage rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("Subscription rendered test", async () => {
      const subscription = dtestData.dSubscription();
      getUserSubscriptionMock.mockResolvedValue(subscription);

      const { container } = await renderAsyncRSC(Subscription, {});

      await waitFor(() => {
         assertRendered();
         expect(getUserSubscriptionMock).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });
});
