import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument } from "@tests";
import mockRouter from "next-router-mock";

import { CreateTemplateButton } from "./create-template-button";

const assertRendered = () => {
   const btn = screen.getByTestId("create-prompt-btn");
   assertInDocument(btn);
};

const assertPlanUpgradeDialogRendered = () => {
   const dialog = screen.getByTestId("upgrade-plan-dialog");
   assertInDocument(dialog);
};

const assertPlanUpgradeDialogNotgRendered = () => {
   const dialog = screen.queryByTestId("upgrade-plan-dialog");
   assertNotInDocument(dialog);
};

describe("CreateTemplateButton rendering tests", () => {
   it("requirePlanUpgrade false - size undefined - rendered test", async () => {
      const { container } = render(<CreateTemplateButton />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("requirePlanUpgrade false - size sm - rendered test", async () => {
      const { container } = render(<CreateTemplateButton size="sm" />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("requirePlanUpgrade true - test", async () => {
      const { container } = render(
         <CreateTemplateButton requirePlanUpgrade={true} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("CreateTemplateButton functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      mockRouter.push("/");
   });

   it("requirePlanUpgrade false - btn clicked - test", async () => {
      render(<CreateTemplateButton />);

      await waitFor(() => {
         assertRendered();
         expect(mockRouter.pathname).toEqual("/");
      });

      const btn = screen.getByTestId("create-prompt-btn");
      await userEvent.click(btn);

      await waitFor(() => {
         expect(mockRouter.pathname).toEqual("/templates/new");
      });
   });

   it("requirePlanUpgrade true - btn clicked - test", async () => {
      render(<CreateTemplateButton requirePlanUpgrade={true} />);

      await waitFor(() => {
         assertRendered();
         assertPlanUpgradeDialogNotgRendered();
      });

      const btn = screen.getByTestId("create-prompt-btn");
      await userEvent.click(btn);

      await waitFor(() => {
         assertPlanUpgradeDialogRendered();
      });

      const cancelBtn = screen.getByTestId("cancel-btn");
      await userEvent.click(cancelBtn);

      await waitFor(() => {
         assertPlanUpgradeDialogNotgRendered();
      });
   });
});
