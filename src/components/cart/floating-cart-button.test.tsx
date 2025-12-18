import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData } from "@tests";

import { FloatingCartButton } from "./floating-cart-button";

const assertRendered = () => {
   const cartBtn = screen.getByTestId("floating-cart-btn");
   assertInDocument(cartBtn);
};

describe("FloatingCartButton rendering tests", () => {
   it("FloatingCartButton rendered test", async () => {
      const cart = dtestData.dCart();
      const { container } = render(
         <FloatingCartButton cart={cart} onClick={jest.fn()} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("FloatingCartButton functionality tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("FloatingCartButton - remove btn clicked - result.success true - test", async () => {
      const cart = dtestData.dCart();
      const onClickFn = jest.fn();

      render(<FloatingCartButton cart={cart} onClick={onClickFn} />);

      await waitFor(() => {
         assertRendered();
         expect(onClickFn).not.toHaveBeenCalled();
      });

      const cartBtn = screen.getByTestId("floating-cart-btn");
      await userEvent.click(cartBtn);

      await waitFor(() => {
         expect(onClickFn).toHaveBeenCalledTimes(1);
      });
   });
});
