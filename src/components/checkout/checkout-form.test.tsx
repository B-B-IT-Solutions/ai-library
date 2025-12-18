jest.mock("@/data/actions/stripe/stripe.actions");
jest.mock("sonner");

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument, dtestData } from "@tests";
import { toast } from "sonner";

import { createCheckoutSession } from "@/data/actions/stripe";

import { CheckoutForm } from "./checkout-form";

const createCheckoutSessionMock = createCheckoutSession as jest.MockedFunction<
   typeof createCheckoutSession
>;
const toastMock = toast as jest.MockedFunction<typeof toast>;

const assertRendered = () => {
   const form = screen.getByTestId("checkout-form");
   const termsChkBox = screen.getByTestId("terms-checkbox");
   const paymentBtn = screen.getByTestId("proceed-to-payment-btn");

   assertInDocument(form);
   assertInDocument(termsChkBox);
   assertInDocument(paymentBtn);
};

const assertErrorRendered = () => {
   const error = screen.getByTestId("error-message");
   assertInDocument(error);
};

const assertErrorNotRendered = () => {
   const error = screen.queryByTestId("error-message");
   assertNotInDocument(error);
};

describe("CheckoutForm functionality tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("CheckoutForm - cart empty - test", async () => {
      const cart = dtestData.dCart();
      cart.items = [];
      const { container } = render(<CheckoutForm cart={cart} />);

      await waitFor(() => {
         assertRendered();
      });
      expect(container).toMatchSnapshot();
   });

   it("CheckoutForm - cart with items - test", async () => {
      const cart = dtestData.dCart();
      const { container } = render(<CheckoutForm cart={cart} />);

      await waitFor(() => {
         assertRendered();
      });
      expect(container).toMatchSnapshot();
   });
});

describe("CheckoutForm functionality tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("CheckoutForm - payment btn clicked - resut.success true - test", async () => {
      const stripeResult = {
         success: true,
         data: {
            sessionId: "1",
            url: "https://stripe.url.com",
         },
         message: "payment link created",
      };
      createCheckoutSessionMock.mockResolvedValue(stripeResult);

      const cart = dtestData.dCart();
      render(<CheckoutForm cart={cart} />);

      await waitFor(() => {
         assertRendered();
         assertErrorNotRendered();
         expect(createCheckoutSessionMock).not.toHaveBeenCalled();
      });

      const paymentBtn = screen.getByTestId("proceed-to-payment-btn");
      await userEvent.click(paymentBtn);

      await waitFor(() => {
         assertErrorRendered();
         expect(createCheckoutSessionMock).not.toHaveBeenCalled();
      });

      const terms = screen.getByTestId("terms-checkbox");
      await userEvent.click(terms);

      await waitFor(() => {
         assertErrorNotRendered();
         expect(createCheckoutSessionMock).not.toHaveBeenCalled();
      });

      await userEvent.click(paymentBtn);

      await waitFor(() => {
         expect(createCheckoutSessionMock).toHaveBeenCalledTimes(1);
      });
   });

   it("CheckoutForm - payment btn clicked - resut.success false - test", async () => {
      const stripeResult = {
         success: false,
         message: "cart is empty.",
      };
      createCheckoutSessionMock.mockResolvedValue(stripeResult);

      const cart = dtestData.dCart();
      render(<CheckoutForm cart={cart} />);

      await waitFor(() => {
         assertRendered();
         assertErrorNotRendered();
         expect(createCheckoutSessionMock).not.toHaveBeenCalled();
      });

      const paymentBtn = screen.getByTestId("proceed-to-payment-btn");
      await userEvent.click(paymentBtn);

      await waitFor(() => {
         assertErrorRendered();
         expect(createCheckoutSessionMock).not.toHaveBeenCalled();
      });

      const terms = screen.getByTestId("terms-checkbox");
      await userEvent.click(terms);

      await waitFor(() => {
         assertErrorNotRendered();
         expect(createCheckoutSessionMock).not.toHaveBeenCalled();
      });

      await userEvent.click(paymentBtn);

      await waitFor(() => {
         expect(createCheckoutSessionMock).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(stripeResult.message);
      });
   });
});
