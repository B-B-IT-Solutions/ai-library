import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument } from "@tests";
import mockRouter from "next-router-mock";

import { CreatePromptButton } from "./create-prompt-button";

const assertRendered = () => {
   const btn = screen.getByTestId("create-prompt-btn");
   assertInDocument(btn);
};

const assertDialogRendered = () => {
   const dialog = screen.getByTestId("upgrade-plan-dialog");
   assertInDocument(dialog);
};

const assertDialogNotRendered = () => {
   const dialog = screen.queryByTestId("upgrade-plan-dialog");
   assertNotInDocument(dialog);
};

describe("CreatePromptButton rendering tests", () => {
   it("requirePlanUpgrade false - size undefined - rendered test", async () => {
      const { container } = render(<CreatePromptButton />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("requirePlanUpgrade false - size sm - rendered test", async () => {
      const { container } = render(<CreatePromptButton size="sm" />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("requirePlanUpgrade true - test", async () => {
      const { container } = render(
         <CreatePromptButton requirePlanUpgrade={true} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("collectionId provided - test", async () => {
      const { container } = render(
         <CreatePromptButton collectionId="test-collection-id" />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("CreatePromptButton functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      mockRouter.push("/");
   });

   it("requirePlanUpgrade false - btn clicked - test", async () => {
      render(<CreatePromptButton />);

      await waitFor(() => {
         assertRendered();
         expect(mockRouter.asPath).toEqual("/");
      });

      const btn = screen.getByTestId("create-prompt-btn");
      await userEvent.click(btn);

      await waitFor(() => {
         expect(mockRouter.asPath).toEqual("/templates/new");
      });
   });

   it("collectionId provided - btn clicked - test", async () => {
      const collectionId = "test-collection-id";
      render(<CreatePromptButton collectionId={collectionId} />);

      await waitFor(() => {
         assertRendered();
         expect(mockRouter.asPath).toEqual("/");
      });

      const btn = screen.getByTestId("create-prompt-btn");
      await userEvent.click(btn);

      await waitFor(() => {
         expect(mockRouter.pathname).toEqual("/templates/new");
         expect(mockRouter.query).toEqual({ collectionId });
      });
   });

   it("requirePlanUpgrade true - btn clicked - test", async () => {
      render(<CreatePromptButton requirePlanUpgrade={true} />);

      await waitFor(() => {
         assertRendered();
         assertDialogNotRendered();
      });

      const btn = screen.getByTestId("create-prompt-btn");
      await userEvent.click(btn);

      await waitFor(() => {
         assertDialogRendered();
      });

      const cancelBtn = screen.getByTestId("cancel-btn");
      await userEvent.click(cancelBtn);

      await waitFor(() => {
         assertDialogNotRendered();
      });
   });
});
