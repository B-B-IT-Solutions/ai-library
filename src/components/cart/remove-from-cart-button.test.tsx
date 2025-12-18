jest.mock("@/data/actions/cart/cart.actions");
jest.mock("sonner");

import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData } from "@tests";
import mockRouter from "next-router-mock";
import { toast } from "sonner";

import { removeFromCart } from "@/data/actions/cart/cart.actions";

import { RemoveFromCartButton } from "./remove-from-cart-button";

const toastMock = toast as jest.MockedFunction<typeof toast>;

const removeFromCartMock = removeFromCart as jest.MockedFunction<
   typeof removeFromCart
>;

const assertRendered = () => {
   const removeBtn = screen.getByTestId("remove-from-cart-btn");
   assertInDocument(removeBtn);
};

describe("RemoveFromCartButton rendering tests", () => {
   it("RemoveFromCartButton - iconX true - test", async () => {
      const item = dtestData.dCartItem();
      const { container } = render(
         <RemoveFromCartButton item={item} iconX={true} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("RemoveFromCartButton - iconX false - test", async () => {
      const item = dtestData.dCartItem();
      const { container } = render(
         <RemoveFromCartButton
            item={item}
            iconX={false}
            className="text-slate-400 hover:text-red-500 transition-colors p-1 disabled:opacity-50 bg-transparent hover:bg-transparent"
         />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("RemoveFromCartButton functionality tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("RemoveFromCartButton - remove btn clicked - result.success true - test", async () => {
      const addResult = {
         success: true,
         message: "item removed",
      };
      removeFromCartMock.mockResolvedValue(addResult);

      const item = dtestData.dCartItem();
      render(<RemoveFromCartButton item={item} />);

      await waitFor(() => {
         assertRendered();
         expect(removeFromCartMock).not.toHaveBeenCalled();
      });

      const removeBtn = screen.getByTestId("remove-from-cart-btn");
      await userEvent.click(removeBtn);

      await waitFor(() => {
         expect(removeFromCartMock).toHaveBeenCalledTimes(1);
         expect(removeFromCartMock).toHaveBeenCalledWith(item.id);
         expect(toastMock.success).toHaveBeenCalledTimes(1);
         expect(toastMock.success).toHaveBeenCalledWith(addResult.message, {
            duration: 1000,
         });
         expect(mockRouter.refresh).toHaveBeenCalledTimes(1);
      });
   });

   it("RemoveFromCartButton - remove btn clicked - result.success false - test", async () => {
      const addResult = {
         success: false,
         message: "item not removed",
      };
      removeFromCartMock.mockResolvedValue(addResult);

      const item = dtestData.dCartItem();
      render(<RemoveFromCartButton item={item} />);

      await waitFor(() => {
         assertRendered();
         expect(removeFromCartMock).not.toHaveBeenCalled();
      });

      const removeBtn = screen.getByTestId("remove-from-cart-btn");
      await userEvent.click(removeBtn);

      await waitFor(() => {
         expect(removeFromCartMock).toHaveBeenCalledTimes(1);
         expect(removeFromCartMock).toHaveBeenCalledWith(item.id);
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(addResult.message);
         expect(mockRouter.refresh).toHaveBeenCalledTimes(1);
      });
   });
});
