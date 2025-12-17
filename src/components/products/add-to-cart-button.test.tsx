jest.mock("@/data/actions/cart/cart.actions");
jest.mock("sonner");

import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData } from "@tests";
import { toast } from "sonner";

import { addToCart } from "@/data/actions/cart/cart.actions";

import { AddToCartButton } from "./add-to-cart-button";

const toastMock = toast as jest.MockedFunction<typeof toast>;

const addToCartMock = addToCart as jest.MockedFunction<typeof addToCart>;

const assertRendered = () => {
   const addToCartBtn = screen.getByTestId("add-to-cart-btn");
   assertInDocument(addToCartBtn);
};

describe("AddToCartButton rendering tests", () => {
   it("AddToCartButton - isInCart false - rendered", async () => {
      const product = dtestData.dProduct();
      const { container } = render(
         <AddToCartButton product={product} isInCart={false} size="default" />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("AddToCartButton - isInCart true - rendered", async () => {
      const product = dtestData.dProduct();
      const { container } = render(
         <AddToCartButton product={product} isInCart={true} size="lg" />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("AddToCartButton functionality tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("AddToCartButton - add btn clicked - result.success true - test", async () => {
      const addResult = {
         success: true,
         message: "product added",
      };
      addToCartMock.mockResolvedValue(addResult);

      const product = dtestData.dProduct();
      render(<AddToCartButton product={product} isInCart={false} />);

      await waitFor(() => {
         assertRendered();
         expect(addToCartMock).not.toHaveBeenCalled();
      });

      const addBtn = screen.getByTestId("add-to-cart-btn");
      await userEvent.click(addBtn);

      await waitFor(() => {
         expect(addToCartMock).toHaveBeenCalledTimes(1);
         expect(addToCartMock).toHaveBeenCalledWith(product.id, 1);
         expect(toastMock.success).toHaveBeenCalledTimes(1);
         expect(toastMock.success).toHaveBeenCalledWith(addResult.message);
      });
   });

   it("AddToCartButton - add btn clicked - result.success false - test", async () => {
      const addResult = {
         success: false,
         message: "item not added",
      };
      addToCartMock.mockResolvedValue(addResult);

      const product = dtestData.dProduct();

      render(<AddToCartButton product={product} isInCart={false} />);

      await waitFor(() => {
         assertRendered();
         expect(addToCartMock).not.toHaveBeenCalled();
      });

      const addBtn = screen.getByTestId("add-to-cart-btn");
      await userEvent.click(addBtn);

      await waitFor(() => {
         expect(addToCartMock).toHaveBeenCalledTimes(1);
         expect(addToCartMock).toHaveBeenCalledWith(product.id, 1);
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(addResult.message);
      });
   });
});
