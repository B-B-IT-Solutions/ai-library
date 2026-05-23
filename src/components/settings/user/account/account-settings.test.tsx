jest.mock("@/data/actions/subscription");

import { screen, waitFor } from "@testing-library/react";
import { assertInDocument, dtestData, renderAsyncRSC } from "@tests";

import { getSubscription } from "@/data/actions/subscription";

import { AccountSettings } from "./account-settings";

const getSubscriptionMock = getSubscription as jest.MockedFunction<
   typeof getSubscription
>;

const assertRendered = () => {
   const settings = screen.getByTestId("account-settings");
   const deleteAccount = screen.getByTestId("delete-account");

   assertInDocument(settings);
   assertInDocument(deleteAccount);
};

describe("AccountSettings rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("AccountSettings rendered - no subscription - test", async () => {
      getSubscriptionMock.mockResolvedValue(null);

      const { container } = await renderAsyncRSC(AccountSettings, {});

      await waitFor(() => {
         assertRendered();
         expect(screen.getByTestId("delete-btn")).toBeInTheDocument();
         expect(getSubscriptionMock).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });

   it("AccountSettings rendered - active subscription - shows blocked notice - test", async () => {
      const subscription = dtestData.dSubscription();
      getSubscriptionMock.mockResolvedValue(subscription);

      const { container } = await renderAsyncRSC(AccountSettings, {});

      await waitFor(() => {
         assertRendered();
         expect(screen.getByTestId("delete-blocked-notice")).toBeInTheDocument();
         expect(screen.queryByTestId("delete-btn")).not.toBeInTheDocument();
         expect(getSubscriptionMock).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });
});
