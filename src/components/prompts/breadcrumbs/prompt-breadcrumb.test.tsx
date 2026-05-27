import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument } from "@tests";
import mockRouter from "next-router-mock";

import { PromptBreadcrumb } from "./prompt-breadcrumb";

const assertRendered = () => {
   const breadcrumbs = screen.getByTestId("template-breadcrumb");
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
   it("variant new - root undefined - test", async () => {
      const { container } = render(<PromptBreadcrumb variant="new" />);

      await waitFor(() => {
         assertRendered();
         assertItemLinkNotRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("variant new - root defined - test", async () => {
      const { container } = render(
         <PromptBreadcrumb
            variant="new"
            root={{
               href: "/root/1",
               label: "Root Label 1",
            }}
         />
      );

      await waitFor(() => {
         assertRendered();
         assertItemLinkNotRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("variant view - root undefined - test", async () => {
      const { container } = render(
         <PromptBreadcrumb variant="view" label="Template 1" />
      );

      await waitFor(() => {
         assertRendered();
         assertItemLinkNotRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("variant view - root defined - test", async () => {
      const { container } = render(
         <PromptBreadcrumb
            variant="view"
            label="Template 1"
            root={{
               href: "/root/2",
               label: "Root Label 2",
            }}
         />
      );

      await waitFor(() => {
         assertRendered();
         assertItemLinkNotRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("variant edit - root undefined - test", async () => {
      const { container } = render(
         <PromptBreadcrumb
            variant="edit"
            label="Template 2"
            entryId="entry-id-1"
         />
      );

      await waitFor(() => {
         assertRendered();
         assertItemLinkRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("variant edit - root defined - test", async () => {
      const { container } = render(
         <PromptBreadcrumb
            variant="edit"
            label="Template 2"
            entryId="entry-id-1"
            root={{
               href: "/root/3",
               label: "Root Label 3",
            }}
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

   it("variant new - root link clicked - test", async () => {
      render(<PromptBreadcrumb variant="new" />);

      await waitFor(() => {
         assertRendered();
      });

      const rootLink = screen.getByTestId("root-link");
      await userEvent.click(rootLink);

      await waitFor(() => {
         expect(mockRouter.pathname).toEqual("/templates");
      });
   });

   it("variant view - root link clicked - test", async () => {
      render(<PromptBreadcrumb variant="view" label="Template 1" />);

      await waitFor(() => {
         assertRendered();
      });

      const rootLink = screen.getByTestId("root-link");
      await userEvent.click(rootLink);

      await waitFor(() => {
         expect(mockRouter.pathname).toEqual("/templates");
      });
   });

   it("variant edit - item link clicked - test", async () => {
      render(
         <PromptBreadcrumb
            variant="edit"
            label="Template 123"
            entryId="entry-id-123"
         />
      );

      await waitFor(() => {
         assertRendered();
      });

      const itemLink = screen.getByTestId("item-link");
      await userEvent.click(itemLink);

      await waitFor(() => {
         expect(mockRouter.pathname).toEqual("/templates/entry-id-123");
      });
   });
});
