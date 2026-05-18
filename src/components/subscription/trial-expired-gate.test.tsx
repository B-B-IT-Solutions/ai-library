jest.mock("@/data/actions/subscription");
jest.mock("@/components/settings/user/subscription/buttons", () => ({
   ActivateSubscriptionButton: ({
      planId,
      isPopular,
   }: {
      planId: string;
      isPopular: boolean;
   }) => (
      <button
         data-testid="activate-subscription-btn"
         data-plan-id={planId}
         data-popular={String(isPopular)}
      >
         Subscribe
      </button>
   ),
}));
jest.mock("@/components/subscription/buttons/choose-free-plan-button", () => ({
   ChooseFreePlanButton: () => (
      <button data-testid="choose-free-plan-btn">Kostenlos starten</button>
   ),
}));

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderAsyncRSC } from "@tests";

import { getSubscriptionPlans } from "@/data/actions/subscription";
import { DSubscriptionPlan } from "@/data/types/domain/subscription";

import { TrialExpiredGate } from "./trial-expired-gate";

const getSubscriptionPlansMock = getSubscriptionPlans as jest.MockedFunction<
   typeof getSubscriptionPlans
>;

const buildPlans = (): DSubscriptionPlan[] => {
   const free = dtestData.dSubscriptionPlan(0);
   free.tier = "FREE";
   free.name = "Free";
   free.monthlyPrice = 0;
   free.yearlyPrice = 0;

   const basic = dtestData.dSubscriptionPlan(1);
   basic.tier = "BASIC";
   basic.name = "Basic";
   basic.yearlyPrice = 99;

   const pro = dtestData.dSubscriptionPlan(2);
   pro.tier = "PRO";
   pro.name = "Pro";
   pro.yearlyPrice = 199;

   return [free, basic, pro];
};

describe("TrialExpiredGate rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      getSubscriptionPlansMock.mockResolvedValue(buildPlans());
   });

   it("renders the gate with correct heading - test", async () => {
      await renderAsyncRSC(TrialExpiredGate, {});

      await waitFor(() => {
         const gate = screen.getByTestId("trial-expired-gate");
         assertInDocument(gate);
         expect(gate.textContent).toContain("Testphase");
      });
   });

   it("renders 3 pricing plan cards (FREE, BASIC, PRO) - test", async () => {
      await renderAsyncRSC(TrialExpiredGate, {});

      await waitFor(() => {
         const planCards = screen.getAllByTestId("pricing-plan");
         expect(planCards).toHaveLength(3);
      });
   });

   it("FREE plan uses ChooseFreePlanButton - test", async () => {
      await renderAsyncRSC(TrialExpiredGate, {});

      await waitFor(() => {
         const btn = screen.getByTestId("choose-free-plan-btn");
         assertInDocument(btn);
      });
   });

   it("paid plan cards contain ActivateSubscriptionButton - test", async () => {
      await renderAsyncRSC(TrialExpiredGate, {});

      await waitFor(() => {
         const btns = screen.getAllByTestId("activate-subscription-btn");
         expect(btns).toHaveLength(2);
      });
   });

   it("PRO card shows popular badge - test", async () => {
      await renderAsyncRSC(TrialExpiredGate, {});

      await waitFor(() => {
         const popularBadge = screen.getByTestId("popular-badge");
         assertInDocument(popularBadge);
      });
   });

   it("does not render app content (children) - test", async () => {
      await renderAsyncRSC(TrialExpiredGate, {});

      await waitFor(() => {
         expect(screen.queryByTestId("sidebar")).not.toBeInTheDocument();
         expect(
            screen.queryByTestId("authenticated-layout-wrapper")
         ).not.toBeInTheDocument();
      });
   });
});
