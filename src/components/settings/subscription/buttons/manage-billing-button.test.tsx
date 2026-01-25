jest.mock("@/data/actions/subscription");
jest.mock("@/lib/utils");
jest.mock("sonner");

import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument } from "@tests";
import { toast } from "sonner";

import { createCustomerPortal } from "@/data/actions/subscription";
import { navigateToExternalUrl } from "@/lib/utils";

import { ManageBillingButton } from "./manage-billing-button";

const navigateToExternalUrlMock = navigateToExternalUrl as jest.MockedFunction<
   typeof navigateToExternalUrl
>;

const toastMock = toast as jest.MockedFunction<typeof toast>;

const createCustomerPortalMock = createCustomerPortal as jest.MockedFunction<
   typeof createCustomerPortal
>;

const assertRendered = () => {
   const btn = screen.getByTestId("manage-billing-btn");
   assertInDocument(btn);
};

describe("ManageBillingButton rendering tests", () => {
   it("ManageBillingButton rendered test", async () => {
      const { container } = render(<ManageBillingButton />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("ManageBillingButton functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("ManageBillingButton - btn clicked - result.success true - test", async () => {
      const result = {
         success: true,
         message: "portal created",
         data: {
            url: "http://portal.url.stripe",
         },
      };
      createCustomerPortalMock.mockResolvedValue(result);

      render(<ManageBillingButton />);

      await waitFor(() => {
         assertRendered();
         expect(createCustomerPortalMock).not.toHaveBeenCalled();
      });

      const btn = screen.getByTestId("manage-billing-btn");
      await userEvent.click(btn);

      await waitFor(() => {
         expect(createCustomerPortalMock).toHaveBeenCalledTimes(1);
         expect(navigateToExternalUrlMock).toHaveBeenCalledTimes(1);
         expect(navigateToExternalUrlMock).toHaveBeenCalledWith(
            result.data.url
         );
      });
   });

   it("ManageBillingButton - btn clicked - result.success false - test", async () => {
      const result = {
         success: false,
         message: "portal couldn't be created",
      };
      createCustomerPortalMock.mockResolvedValue(result);

      render(<ManageBillingButton />);

      await waitFor(() => {
         assertRendered();
         expect(createCustomerPortalMock).not.toHaveBeenCalled();
      });

      const btn = screen.getByTestId("manage-billing-btn");
      await userEvent.click(btn);

      await waitFor(() => {
         expect(createCustomerPortalMock).toHaveBeenCalledTimes(1);
         expect(navigateToExternalUrlMock).not.toHaveBeenCalled();
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(result.message);
      });
   });
});
