import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument } from "@tests";
import mockRouter from "next-router-mock";

import { ItemDetailsBreadcrumb } from "./item-details-breadcrumb";

const assertRendered = () => {
   const breadcrumb = screen.getByTestId("item-details-breadcrumb");
   const rootLink = screen.getByTestId("root-link");

   assertInDocument(breadcrumb);
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

describe("ItemDetailsBreadcrumb rendering test", () => {
   it("variant - new - test", async () => {
      const { container } = render(
         <ItemDetailsBreadcrumb
            root={{
               label: "Vorlagen",
               href: "/templates",
            }}
            page={{
               label: "Neue Vorlage",
            }}
            variant="new"
         />
      );

      await waitFor(() => {
         assertRendered();
         assertItemLinkNotRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("variant - view - test", async () => {
      const { container } = render(
         <ItemDetailsBreadcrumb
            root={{
               label: "Vorlagen",
               href: "/templates",
            }}
            variant="view"
            page={{
               label: "Template 1",
               tooltip: "Tooltip 1",
            }}
         />
      );

      await waitFor(() => {
         assertRendered();
         assertItemLinkNotRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("variant - edit - test", async () => {
      const { container } = render(
         <ItemDetailsBreadcrumb
            root={{
               label: "Vorlagen",
               href: "/templates",
            }}
            variant="edit"
            link={{
               href: "/templates/entry-id-1",
               label: "Template 2",
               tooltip: "Tooltip 2",
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

describe("ItemDetailsBreadcrumb funtionality tests", () => {
   beforeEach(() => {
      mockRouter.push("/");
   });

   it("variant - new - root link clicked - test", async () => {
      render(
         <ItemDetailsBreadcrumb
            root={{
               label: "Vorlagen",
               href: "/templates",
            }}
            variant="new"
            page={{
               label: "Neue Vorlage",
            }}
         />
      );

      await waitFor(() => {
         assertRendered();
      });

      const rootLink = screen.getByTestId("root-link");
      await userEvent.click(rootLink);

      await waitFor(() => {
         expect(mockRouter.pathname).toEqual("/templates");
      });
   });

   it("variant - view - root link clicked - test", async () => {
      render(
         <ItemDetailsBreadcrumb
            root={{
               label: "Vorlagen",
               href: "/templates",
            }}
            variant="view"
            page={{
               label: "Template 1",
               tooltip: "Tooltip 1",
            }}
         />
      );

      await waitFor(() => {
         assertRendered();
      });

      const rootLink = screen.getByTestId("root-link");
      await userEvent.click(rootLink);

      await waitFor(() => {
         expect(mockRouter.pathname).toEqual("/templates");
      });
   });

   it("variant - edit - item link clicked - test", async () => {
      render(
         <ItemDetailsBreadcrumb
            root={{
               label: "Vorlagen",
               href: "/templates",
            }}
            variant="edit"
            link={{
               href: "/templates/entry-id-123",
               label: "Template 2",
               tooltip: "Tooltip 2",
            }}
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
