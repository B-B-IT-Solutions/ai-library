import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument } from "@tests";

import { WorfklowCompleted } from "./workflow-completed";

const assertRendered = () => {
   const completed = screen.getByTestId("workflow-completed");
   const restartBtn = screen.getByTestId("restart-btn");

   assertInDocument(completed);
   assertInDocument(restartBtn);
};

describe("WorfklowCompleted rendering tests", () => {
   it("stepCount 1 - test", async () => {
      const { container } = render(
         <WorfklowCompleted stepCount={1} onRestart={jest.fn()} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("stepCount 5 - test", async () => {
      const { container } = render(
         <WorfklowCompleted stepCount={5} onRestart={jest.fn()} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("WorfklowCompleted functionality tests", () => {
   it("restart btn clicked  - test", async () => {
      const restartFn = jest.fn();
      render(<WorfklowCompleted stepCount={1} onRestart={restartFn} />);

      await waitFor(() => {
         assertRendered();
         expect(restartFn).not.toHaveBeenCalled();
      });

      const restartBtn = screen.getByTestId("restart-btn");
      await userEvent.click(restartBtn);

      await waitFor(() => {
         expect(restartFn).toHaveBeenCalledTimes(1);
      });
   });
});
