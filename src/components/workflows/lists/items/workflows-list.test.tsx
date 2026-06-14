import { createRef } from "react";
import { screen, waitFor } from "@testing-library/react";
import { assertInDocument, dtestData, renderWithReactQuery } from "@tests";

import { WorfklowsList } from "./workflows-list";

const assertRendered = () => {
   const entries = screen.getByTestId("workflows-list");
   assertInDocument(entries);
};

describe("WorfklowsList rendering tests", () => {
   it("workflows - test", async () => {
      const workflows = dtestData.dWorkflows();

      const { container } = renderWithReactQuery(
         <WorfklowsList workflows={workflows} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("WorfklowsList ref tests", () => {
   it("ref is forwarded to the last item DOM element - test", async () => {
      const ref = createRef<HTMLDivElement>();
      const workflows = dtestData.dWorkflows(); // 3 items

      renderWithReactQuery(<WorfklowsList workflows={workflows} ref={ref} />);

      await waitFor(() => {
         const items = screen.getAllByTestId("workflow-item");
         expect(ref.current).not.toBeNull();
         expect(ref.current).toBe(items[items.length - 1]);
      });
   });
});
