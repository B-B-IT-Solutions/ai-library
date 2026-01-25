jest.mock("@/data/actions/subscription");
jest.mock("sonner");

import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument } from "@tests";
import mockRouter from "next-router-mock";
import { toast } from "sonner";

import { reactivateSubscription } from "@/data/actions/subscription";
import { ActionResult } from "@/data/types/utils";

import { ReactivateSubscriptionButton } from "./reactivate-subscription-button";

const toastMock = toast as jest.MockedFunction<typeof toast>;

const reactivateSubscriptionMock =
   reactivateSubscription as jest.MockedFunction<typeof reactivateSubscription>;

const assertRendered = () => {
   const btn = screen.getByTestId("reactivate-subscription-btn");
   assertInDocument(btn);
};

describe("ReactivateSubscriptionButton rendering tests", () => {
   it("ReactivateSubscriptionButton rendered test", async () => {
      const { container } = render(<ReactivateSubscriptionButton />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("ReactivateSubscriptionButton functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("ReactivateSubscriptionButton - btn clicked - result.success true - test", async () => {
      const result: ActionResult = {
         success: true,
         message: "subscripton reactivated",
      };
      reactivateSubscriptionMock.mockResolvedValue(result);

      render(<ReactivateSubscriptionButton />);

      await waitFor(() => {
         assertRendered();
         expect(reactivateSubscriptionMock).not.toHaveBeenCalled();
      });

      const btn = screen.getByTestId("reactivate-subscription-btn");
      await userEvent.click(btn);

      await waitFor(() => {
         expect(reactivateSubscriptionMock).toHaveBeenCalledTimes(1);
         expect(toastMock.success).toHaveBeenCalledTimes(1);
         expect(toastMock.success).toHaveBeenCalledWith(result.message);
         expect(mockRouter.refresh).toHaveBeenCalledTimes(1);
      });
   });

   it("ReactivateSubscriptionButton - btn clicked - result.success false - test", async () => {
      const result = {
         success: false,
         message: "subscripton couldn't reactivated",
      };
      reactivateSubscriptionMock.mockResolvedValue(result);

      render(<ReactivateSubscriptionButton />);

      await waitFor(() => {
         assertRendered();
         expect(reactivateSubscriptionMock).not.toHaveBeenCalled();
      });

      const btn = screen.getByTestId("reactivate-subscription-btn");
      await userEvent.click(btn);

      await waitFor(() => {
         expect(reactivateSubscriptionMock).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(result.message);
         expect(mockRouter.refresh).toHaveBeenCalledTimes(1);
      });
   });
});
