jest.mock("@/data/actions/stripe");
jest.mock("sonner");

import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument } from "@tests";
import mockRouter from "next-router-mock";
import { toast } from "sonner";

import { createSubscriptionCheckoutSession } from "@/data/actions/stripe";
import { DStripeCheckoutResponse } from "@/data/types/domain/stripe";
import { DBillingInterval } from "@/data/types/domain/subscription";
import { ActionResult } from "@/data/types/utils";

import { ActivateSubscriptionButton } from "./activate-subscription-button";

const toastMock = toast as jest.MockedFunction<typeof toast>;

const createSubscriptionCheckoutSessionMock =
   createSubscriptionCheckoutSession as jest.MockedFunction<
      typeof createSubscriptionCheckoutSession
   >;

const assertRendered = () => {
   const btn = screen.getByTestId("activate-subscription-btn");
   assertInDocument(btn);
};

describe("CreateSubscriptionButton rendering tests", () => {
   it("CreateSubscriptionButton - isPopular true -  test", async () => {
      const { container } = render(
         <ActivateSubscriptionButton
            planId="1"
            billingInterval="MONTHLY"
            isPopular={true}
         />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("CreateSubscriptionButton - isPopular false -  test", async () => {
      const { container } = render(
         <ActivateSubscriptionButton
            planId="1"
            billingInterval="YEARLY"
            isPopular={false}
         />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("CreateSubscriptionButton functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      mockRouter.push("/");
   });

   it("CreateSubscriptionButton - btn clicked - result.success true - test", async () => {
      const result: ActionResult<DStripeCheckoutResponse> = {
         success: true,
         message: "subscripton activated",
         data: {
            sessionId: "session-id-1",
            url: "/checkout.stripe/success",
         },
      };
      createSubscriptionCheckoutSessionMock.mockResolvedValue(result);

      const planId = "plan-id-1";
      const billingInterval: DBillingInterval = "MONTHLY";
      render(
         <ActivateSubscriptionButton
            planId={planId}
            billingInterval={billingInterval}
            isPopular={false}
         />
      );

      await waitFor(() => {
         assertRendered();
         expect(createSubscriptionCheckoutSessionMock).not.toHaveBeenCalled();
         expect(mockRouter.pathname).toEqual("/");
      });

      const btn = screen.getByTestId("activate-subscription-btn");
      await userEvent.click(btn);

      const expectedPayload = { planId, billingInterval };

      expect(createSubscriptionCheckoutSessionMock).toHaveBeenCalledTimes(1);
      expect(createSubscriptionCheckoutSessionMock).toHaveBeenCalledWith(
         expectedPayload
      );
      expect(mockRouter.pathname).toEqual(result.data!.url);
   });

   it("CreateSubscriptionButton - btn clicked - result.success false - test", async () => {
      const result: ActionResult<DStripeCheckoutResponse> = {
         success: false,
         message: "subscripton couldn't be activated",
      };
      createSubscriptionCheckoutSessionMock.mockResolvedValue(result);

      const planId = "plan-id-123";
      const billingInterval: DBillingInterval = "YEARLY";
      render(
         <ActivateSubscriptionButton
            planId={planId}
            billingInterval={billingInterval}
            isPopular={true}
         />
      );

      await waitFor(() => {
         assertRendered();
         expect(createSubscriptionCheckoutSessionMock).not.toHaveBeenCalled();
      });

      const btn = screen.getByTestId("activate-subscription-btn");
      await userEvent.click(btn);

      const expectedPayload = { planId, billingInterval };
      expect(createSubscriptionCheckoutSessionMock).toHaveBeenCalledTimes(1);
      expect(createSubscriptionCheckoutSessionMock).toHaveBeenCalledWith(
         expectedPayload
      );
      expect(toastMock.error).toHaveBeenCalledTimes(1);
      expect(toastMock.error).toHaveBeenCalledWith(result.message);
      expect(mockRouter.pathname).toEqual("/");
   });
});
