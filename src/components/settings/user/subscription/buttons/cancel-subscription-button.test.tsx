jest.mock("@/data/actions/stripe");
jest.mock("sonner");

import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument, dtestData } from "@tests";
import mockRouter from "next-router-mock";
import { toast } from "sonner";

import { cancelSubscription } from "@/data/actions/stripe";
import { ActionResult } from "@/data/types/utils";

import { CancelSubscriptionButton } from "./cancel-subscription-button";

const toastMock = toast as jest.MockedFunction<typeof toast>;

const cancelSubscriptionMock = cancelSubscription as jest.MockedFunction<
   typeof cancelSubscription
>;

const assertRendered = () => {
   const dialog = screen.getByTestId("dialog");
   const cancelSubscriptionBtn = screen.getByTestId("cancel-subscription-btn");

   assertInDocument(dialog);
   assertInDocument(cancelSubscriptionBtn);
};

const assertDialogContentRendered = () => {
   const content = screen.getByTestId("dialog-content");
   const cancelBtn = screen.getByTestId("cancel-btn");
   const confirmBtn = screen.getByTestId("confirm-btn");

   assertInDocument(content);
   assertInDocument(cancelBtn);
   assertInDocument(confirmBtn);
};

const assertDialogContentNotRendered = () => {
   const content = screen.queryByTestId("dialog-content");
   const cancelBtn = screen.queryByTestId("cancel-btn");
   const confirmBtn = screen.queryByTestId("confirm-btn");

   assertNotInDocument(content);
   assertNotInDocument(cancelBtn);
   assertNotInDocument(confirmBtn);
};

describe("CancelSubscriptionButton rendering tests", () => {
   it("CancelSubscriptionButton rendered test", async () => {
      const subscription = dtestData.dSubscription();
      const { container } = render(
         <CancelSubscriptionButton subscription={subscription} />
      );

      await waitFor(() => {
         assertRendered();
         assertDialogContentNotRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("CancelSubscriptionButton functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("CancelSubscriptionButton - cancel subcription btn clicked - confirm -  result.success true - test", async () => {
      const result: ActionResult = {
         success: true,
         message: "subscripton canceled",
      };
      cancelSubscriptionMock.mockResolvedValue(result);

      const subscription = dtestData.dSubscription();
      render(<CancelSubscriptionButton subscription={subscription} />);

      await waitFor(() => {
         assertRendered();
         assertDialogContentNotRendered();
         expect(cancelSubscriptionMock).not.toHaveBeenCalled();
      });

      const cancelSubscriptionBtn = screen.getByTestId(
         "cancel-subscription-btn"
      );
      await userEvent.click(cancelSubscriptionBtn);

      await waitFor(() => {
         assertDialogContentRendered();
         expect(cancelSubscriptionMock).not.toHaveBeenCalled();
      });

      const confirmBtn = screen.getByTestId("confirm-btn");
      await userEvent.click(confirmBtn);

      await waitFor(() => {
         expect(cancelSubscriptionMock).toHaveBeenCalledTimes(1);
         expect(toastMock.success).toHaveBeenCalledTimes(1);
         expect(toastMock.success).toHaveBeenCalledWith(result.message);
         expect(mockRouter.refresh).toHaveBeenCalledTimes(1);
      });
   });

   it("CancelSubscriptionButton - cancel subcription btn clicked - confirm -  result.success false - test", async () => {
      const result = {
         success: false,
         message: "subscripton couldn't canceled",
      };
      cancelSubscriptionMock.mockResolvedValue(result);

      const subscription = dtestData.dSubscription();
      render(<CancelSubscriptionButton subscription={subscription} />);

      await waitFor(() => {
         assertRendered();
         assertDialogContentNotRendered();
         expect(cancelSubscriptionMock).not.toHaveBeenCalled();
      });

      const cancelSubscriptionBtn = screen.getByTestId(
         "cancel-subscription-btn"
      );
      await userEvent.click(cancelSubscriptionBtn);

      await waitFor(() => {
         assertDialogContentRendered();
         expect(cancelSubscriptionMock).not.toHaveBeenCalled();
      });

      const confirmBtn = screen.getByTestId("confirm-btn");
      await userEvent.click(confirmBtn);

      await waitFor(() => {
         expect(cancelSubscriptionMock).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(result.message);
         expect(mockRouter.refresh).toHaveBeenCalledTimes(1);
      });
   });

   it("CancelSubscriptionButton - cancel subcription btn clicked - cancel - test", async () => {
      const result = {
         success: false,
         message: "subscripton couldn't canceled",
      };
      cancelSubscriptionMock.mockResolvedValue(result);

      const subscription = dtestData.dSubscription();
      subscription.currentPeriodEnd = null;
      render(<CancelSubscriptionButton subscription={subscription} />);

      await waitFor(() => {
         assertRendered();
         assertDialogContentNotRendered();
         expect(cancelSubscriptionMock).not.toHaveBeenCalled();
      });

      const cancelSubscriptionBtn = screen.getByTestId(
         "cancel-subscription-btn"
      );
      await userEvent.click(cancelSubscriptionBtn);

      await waitFor(() => {
         assertDialogContentRendered();
         expect(cancelSubscriptionMock).not.toHaveBeenCalled();
      });

      const cancelBtn = screen.getByTestId("cancel-btn");
      await userEvent.click(cancelBtn);

      await waitFor(() => {
         assertDialogContentNotRendered();
         expect(cancelSubscriptionMock).not.toHaveBeenCalled();
         expect(mockRouter.refresh).not.toHaveBeenCalled();
      });
   });
});
