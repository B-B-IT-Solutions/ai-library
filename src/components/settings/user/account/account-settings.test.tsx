jest.mock("@/data/actions/subscription");

import { screen, waitFor } from "@testing-library/react";
import {
   assertHasAttribute,
   assertHasNoAttribute,
   assertInDocument,
   assertNotInDocument,
   dtestData,
   renderAsyncRSC,
} from "@tests";

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

const assertDeleteEnabledRendered = () => {
   const dialog = screen.getByTestId("delete-account-dialog");
   const deleteBtn = screen.getByTestId("delete-btn");
   const notice = screen.queryByTestId("delete-blocked-notice");

   assertInDocument(dialog);
   assertInDocument(deleteBtn);
   assertNotInDocument(notice);

   assertHasNoAttribute(deleteBtn, "disabled");
};

const assertDeleteDisabledRendered = () => {
   const dialog = screen.getByTestId("delete-account-dialog");
   const deleteBtn = screen.getByTestId("delete-btn");
   const notice = screen.getByTestId("delete-blocked-notice");

   assertInDocument(dialog);
   assertInDocument(deleteBtn);
   assertInDocument(notice);

   assertHasAttribute(deleteBtn, "disabled");
};

describe("AccountSettings rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("subscription null - test", async () => {
      getSubscriptionMock.mockResolvedValue(null);

      const { container } = await renderAsyncRSC(AccountSettings, {});

      await waitFor(() => {
         assertRendered();
         assertDeleteEnabledRendered();
         expect(getSubscriptionMock).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });

   it("subscription ACTIvE - test", async () => {
      const subscription = dtestData.dSubscription();
      subscription.status = "ACTIVE";
      getSubscriptionMock.mockResolvedValue(subscription);

      const { container } = await renderAsyncRSC(AccountSettings, {});

      await waitFor(() => {
         assertRendered();
         assertDeleteDisabledRendered();
         expect(getSubscriptionMock).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });
});
