import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument } from "@tests";
import mockRouter from "next-router-mock";

import { PromptBreadcrumb } from "./prompt-breadcrumb";

const assertRendered = () => {
   const breadcrumbs = screen.getByTestId("prompt-breadcrumb");
   const rootLink = screen.getByTestId("root-link");

   assertInDocument(breadcrumbs);
   assertInDocument(rootLink);
};

const assertItemLinkRendered = () => {
   const itemLink = screen.getByTestId("item-link");
   assertInDocument(itemLink);
};

const assertItemLinkNotRendered = () => {
   const itemLink = screen.queryByTestId("item-link");
   assertNotInDocument(itemLink);
};

describe("PromptBreadcrumb rendering test", () => {
   it("variant - new - test", async () => {
      const { container } = render(<PromptBreadcrumb variant="new" />);

      await waitFor(() => {
         assertRendered();
         assertItemLinkNotRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("variant - view - test", async () => {
      const { container } = render(
         <PromptBreadcrumb variant="view" label="Template 1" />
      );

      await waitFor(() => {
         assertRendered();
         assertItemLinkNotRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("variant - edit - test", async () => {
      const { container } = render(
         <PromptBreadcrumb
            variant="edit"
            label="Template 2"
            promptId="entry-id-1"
         />
      );

      await waitFor(() => {
         assertRendered();
         assertItemLinkRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("PromptBreadcrumb funtionality tests", () => {
   beforeEach(() => {
      mockRouter.push("/");
   });

   it("variant - new - root link clicked - test", async () => {
      render(<PromptBreadcrumb variant="new" />);

      await waitFor(() => {
         assertRendered();
      });

      const rootLink = screen.getByTestId("root-link");
      await userEvent.click(rootLink);

      await waitFor(() => {
         expect(mockRouter.pathname).toEqual("/prompts");
      });
   });

   it("variant - view - root link clicked - test", async () => {
      render(<PromptBreadcrumb variant="view" label="Prompt 1" />);

      await waitFor(() => {
         assertRendered();
      });

      const rootLink = screen.getByTestId("root-link");
      await userEvent.click(rootLink);

      await waitFor(() => {
         expect(mockRouter.pathname).toEqual("/prompts");
      });
   });

   it("variant - edit - item link clicked - test", async () => {
      render(
         <PromptBreadcrumb
            variant="edit"
            label="Prompt 123"
            promptId="prompt-id-123"
         />
      );

      await waitFor(() => {
         assertRendered();
      });

      const itemLink = screen.getByTestId("item-link");
      await userEvent.click(itemLink);

      await waitFor(() => {
         expect(mockRouter.pathname).toEqual("/prompts/prompt-id-123");
      });
   });
});
