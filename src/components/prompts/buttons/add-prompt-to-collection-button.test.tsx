import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument } from "@tests";

import { AddPromptToCollectionButton } from "./add-prompt-to-collection-button";

const assertRendered = () => {
   const btn = screen.getByTestId("add-to-collection-menu-item");
   assertInDocument(btn);
};

describe("AddPromptToCollectionButton rendering tests", () => {
   it("rendered test", async () => {
      const { container } = render(
         <AddPromptToCollectionButton onClick={jest.fn()} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("AddPromptToCollectionButton functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("add btn clicked - test", async () => {
      const onClickFn = jest.fn();

      render(<AddPromptToCollectionButton onClick={onClickFn} />);

      await waitFor(() => {
         assertRendered();
         expect(onClickFn).not.toHaveBeenCalled();
      });

      const btn = screen.getByTestId("add-to-collection-menu-item");
      await userEvent.click(btn);

      await waitFor(() => {
         expect(onClickFn).toHaveBeenCalledTimes(1);
      });
   });
});
