jest.mock("@/data/actions/subscription");

import { screen, waitFor } from "@testing-library/dom";
import {
   assertInDocument,
   AuthMockedFunction,
   dtestData,
   ntestData,
   renderAsyncRSC,
} from "@tests";
import { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import {
   getSubscription,
   getSubscriptionPlans,
} from "@/data/actions/subscription";

import PricingPage, { metadata } from "./page";

const authMock = auth as unknown as AuthMockedFunction;

const getSubscriptionMock = getSubscription as jest.MockedFunction<
   typeof getSubscription
>;
const getSubscriptionPlansMock = getSubscriptionPlans as jest.MockedFunction<
   typeof getSubscriptionPlans
>;
const redirectMock = redirect as jest.MockedFunction<typeof redirect>;

const expectedMetadata: Metadata = {
   title: "Priese",
};

const assertRendered = () => {
   const page = screen.getByTestId("pricing-page");
   const plans = screen.getByTestId("pricing-plans");

   assertInDocument(page);
   assertInDocument(plans);
};

describe("PricingPage rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("PricingPage - session null - redirects to home", async () => {
      authMock.mockResolvedValue(null);

      const { container } = await renderAsyncRSC(PricingPage, {});

      await waitFor(() => {
         expect(authMock).toHaveBeenCalledTimes(1);
         expect(getSubscriptionMock).not.toHaveBeenCalled();
         expect(redirectMock).toHaveBeenCalledTimes(1);
         expect(redirectMock).toHaveBeenCalledWith("/");
      });

      expect(container).toMatchSnapshot();
   });

   it("PricingPage - session.user undefined - redirects to home", async () => {
      const session = ntestData.session();
      session.user = undefined;
      authMock.mockResolvedValue(session);

      const { container } = await renderAsyncRSC(PricingPage, {});

      await waitFor(() => {
         expect(authMock).toHaveBeenCalledTimes(1);
         expect(getSubscriptionMock).not.toHaveBeenCalled();
         expect(redirectMock).toHaveBeenCalledTimes(1);
         expect(redirectMock).toHaveBeenCalledWith("/");
      });

      expect(container).toMatchSnapshot();
   });

   it("PricingPage - session.user.id undefined - redirects to home", async () => {
      const session = ntestData.session();
      session.user.id = undefined;
      authMock.mockResolvedValue(session);

      const { container } = await renderAsyncRSC(PricingPage, {});

      await waitFor(() => {
         expect(authMock).toHaveBeenCalledTimes(1);
         expect(getSubscriptionMock).not.toHaveBeenCalled();
         expect(redirectMock).toHaveBeenCalledTimes(1);
         expect(redirectMock).toHaveBeenCalledWith("/");
      });

      expect(container).toMatchSnapshot();
   });

   it("PricingPage - user retrieved - test", async () => {
      const session = ntestData.session();
      const subscription = dtestData.dSubscription();
      const plans = dtestData.dSubscriptionPlans();
      authMock.mockResolvedValue(session);
      getSubscriptionMock.mockResolvedValue(subscription);
      getSubscriptionPlansMock.mockResolvedValue(plans);

      const { container } = await renderAsyncRSC(PricingPage, {});

      await waitFor(() => {
         assertRendered();
         expect(authMock).toHaveBeenCalledTimes(1);
         expect(getSubscriptionMock).toHaveBeenCalledTimes(1);
         expect(getSubscriptionPlansMock).toHaveBeenCalledTimes(1);
         expect(redirectMock).not.toHaveBeenCalled();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("PricingPage functionality tests", () => {
   it("PricingPage - metadata - test", async () => {
      expect(metadata).toEqual(expectedMetadata);
   });
});
