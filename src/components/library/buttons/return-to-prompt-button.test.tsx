import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument } from "@tests";
import mockRouter from "next-router-mock";

import { ReturnToPromptButton } from "./return-to-prompt-button";

const ENTRY_ID = "test-entry-id";

const assertRendered = () => {
   const btn = screen.getByTestId("return-to-prompt-btn");
   assertInDocument(btn);
};

describe("ReturnToPromptButton rendering tests", () => {
   it("ReturnToPromptButton rendered test", async () => {
      const { container } = render(<ReturnToPromptButton entryId={ENTRY_ID} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("ReturnToPromptButton functionality tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
      mockRouter.push("/");
   });

   it("ReturnToPromptButton - btn clicked - test", async () => {
      render(<ReturnToPromptButton entryId={ENTRY_ID} />);

      await waitFor(() => {
         assertRendered();
         expect(mockRouter.pathname).toEqual("/");
      });

      const btn = screen.getByTestId("return-to-prompt-btn");
      await userEvent.click(btn);

      await waitFor(() => {
         expect(mockRouter.pathname).toEqual(`/library/${ENTRY_ID}`);
      });
   });
});
