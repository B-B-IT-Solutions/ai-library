import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData, renderWithRouter } from "@tests";
import mockRouter from "next-router-mock";

import { OrderCard } from "./order-card";

const assertRendered = () => {
   const card = screen.getByTestId("order-card");
   const viewBtn = screen.getByTestId("view-details-button");

   assertInDocument(card);
   assertInDocument(viewBtn);
};

describe("OrderCard rendering tests", () => {
   it("OrderCard - status COMPLETED - test", async () => {
      const order = dtestData.dOrder();
      order.status = "COMPLETED";
      const item = dtestData.dOrderItem();
      order.items = [item];

      const { container } = renderWithRouter(<OrderCard order={order} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("OrderCard - status PENDING - test", async () => {
      const order = dtestData.dOrder();
      order.status = "PENDING";

      const { container } = renderWithRouter(<OrderCard order={order} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("OrderCard - status REFUNDED - test", async () => {
      const order = dtestData.dOrder();
      order.status = "REFUNDED";

      const { container } = renderWithRouter(<OrderCard order={order} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("OrderCard - status FAILED - test", async () => {
      const order = dtestData.dOrder();
      order.status = "FAILED";

      const { container } = renderWithRouter(<OrderCard order={order} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("OrderCard functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      mockRouter.push("/");
   });

   it("OrderCard - view btn clicked - test", async () => {
      const order = dtestData.dOrder();

      renderWithRouter(<OrderCard order={order} />);

      await waitFor(() => {
         assertRendered();
      });

      const viewBtn = screen.getByTestId("view-details-button");
      await userEvent.click(viewBtn);

      expect(mockRouter.pathname).toEqual(`/orders/${order.id}`);
   });
});
