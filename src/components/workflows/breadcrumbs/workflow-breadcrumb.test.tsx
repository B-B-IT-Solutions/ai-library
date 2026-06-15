import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument, dtestData } from "@tests";
import mockRouter from "next-router-mock";

import { WorkflowBreadcrumb } from "./workflow-breadcrumb";

const assertRendered = () => {
   const breadcrumbs = screen.getByTestId("workflow-breadcrumb");
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

describe("WorkflowBreadcrumb rendering test", () => {
   it("variant new - root undefined - test", async () => {
      const { container } = render(<WorkflowBreadcrumb variant="new" />);

      await waitFor(() => {
         assertRendered();
         assertItemLinkNotRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("variant new - root defined - test", async () => {
      const { container } = render(
         <WorkflowBreadcrumb
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
         <WorkflowBreadcrumb variant="view" label="Workflow 1" />
      );

      await waitFor(() => {
         assertRendered();
         assertItemLinkNotRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("variant view - root defined - test", async () => {
      const { container } = render(
         <WorkflowBreadcrumb
            variant="view"
            label="Workflow 1"
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
      const workflow = dtestData.dWorkflow();
      const { container } = render(
         <WorkflowBreadcrumb variant="edit" workflow={workflow} />
      );

      await waitFor(() => {
         assertRendered();
         assertItemLinkRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("variant edit - root defined - test", async () => {
      const workflow = dtestData.dWorkflow();

      const { container } = render(
         <WorkflowBreadcrumb
            variant="edit"
            workflow={workflow}
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

describe("WorkflowBreadcrumb funtionality tests", () => {
   beforeEach(() => {
      mockRouter.push("/");
   });

   it("variant new - root link clicked - test", async () => {
      render(<WorkflowBreadcrumb variant="new" />);

      await waitFor(() => {
         assertRendered();
      });

      const rootLink = screen.getByTestId("root-link");
      await userEvent.click(rootLink);

      await waitFor(() => {
         expect(mockRouter.pathname).toEqual("/workflows");
      });
   });

   it("variant view - root link clicked - test", async () => {
      render(<WorkflowBreadcrumb variant="view" label="Workflow 1" />);

      await waitFor(() => {
         assertRendered();
      });

      const rootLink = screen.getByTestId("root-link");
      await userEvent.click(rootLink);

      await waitFor(() => {
         expect(mockRouter.pathname).toEqual("/workflows");
      });
   });

   it("variant edit - item link clicked - test", async () => {
      const workflow = dtestData.dWorkflow();

      render(<WorkflowBreadcrumb variant="edit" workflow={workflow} />);

      await waitFor(() => {
         assertRendered();
      });

      const itemLink = screen.getByTestId("item-link");
      await userEvent.click(itemLink);

      await waitFor(() => {
         expect(mockRouter.pathname).toEqual(`/workflows/${workflow.id}`);
      });
   });
});
