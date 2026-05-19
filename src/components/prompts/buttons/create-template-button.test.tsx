import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument } from "@tests";
import mockRouter from "next-router-mock";

import { CreateTemplateButton } from "./create-template-button";

const assertRendered = () => {
   const btn = screen.getByTestId("create-template-btn");
   assertInDocument(btn);
};

describe("CreateTemplateButton rendering tests", () => {
   it("size - undefined - rendered test", async () => {
      const { container } = render(<CreateTemplateButton />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("size - sm - rendered test", async () => {
      const { container } = render(<CreateTemplateButton size="sm" />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("atLimit true - button enabled, no tooltip - test", async () => {
      const { container } = render(<CreateTemplateButton atLimit={true} />);

      await waitFor(() => {
         assertRendered();
      });

      const btn = screen.getByTestId("create-template-btn");
      expect(btn).not.toBeDisabled();
      assertNotInDocument(screen.queryByTestId("create-template-btn-tooltip"));

      expect(container).toMatchSnapshot();
   });
});

describe("CreateTemplateButton functionality tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
      mockRouter.push("/");
   });

   it("create btn clicked - navigates to new template - test", async () => {
      render(<CreateTemplateButton />);

      await waitFor(() => {
         assertRendered();
         expect(mockRouter.pathname).toEqual("/");
      });

      const btn = screen.getByTestId("create-template-btn");
      await userEvent.click(btn);

      await waitFor(() => {
         expect(mockRouter.pathname).toEqual("/templates/new");
      });
   });

   it("atLimit true - btn clicked - upgrade dialog shown - test", async () => {
      render(<CreateTemplateButton atLimit={true} />);

      await waitFor(() => {
         assertRendered();
         assertNotInDocument(screen.queryByTestId("upgrade-plan-dialog"));
      });

      const btn = screen.getByTestId("create-template-btn");
      await userEvent.click(btn);

      await waitFor(() => {
         assertInDocument(screen.getByTestId("upgrade-plan-dialog"));
      });
   });

   it("atLimit true - dialog opened - cancel clicked - dialog closed - test", async () => {
      render(<CreateTemplateButton atLimit={true} />);

      const btn = screen.getByTestId("create-template-btn");
      await userEvent.click(btn);

      await waitFor(() => {
         assertInDocument(screen.getByTestId("upgrade-plan-dialog"));
      });

      const cancelBtn = screen.getByTestId("upgrade-dialog-cancel-btn");
      await userEvent.click(cancelBtn);

      await waitFor(() => {
         assertNotInDocument(screen.queryByTestId("upgrade-plan-dialog"));
      });
   });
});
