import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
   assertHasAttributeWithValue,
   assertInDocument,
   assertNotInDocument,
} from "@tests";
import mockRouter from "next-router-mock";

import { CreateWorfklowButton } from "./create-workflow-button";

const assertRendered = () => {
   const btn = screen.getByTestId("create-workflow-btn");
   assertInDocument(btn);
};

const assertBtnHrefAttribute = (href: string) => {
   const btn = screen.getByTestId("create-workflow-btn");
   assertHasAttributeWithValue(btn, "href", href);
};

const assertDialogRendered = () => {
   const dialog = screen.getByTestId("upgrade-plan-dialog");
   assertInDocument(dialog);
};

const assertDialogNotRendered = () => {
   const dialog = screen.queryByTestId("upgrade-plan-dialog");
   assertNotInDocument(dialog);
};

describe("CreateWorfklowButton rendering tests", () => {
   it("requirePlanUpgrade false - size undefined - test", async () => {
      const { container } = render(<CreateWorfklowButton />);

      await waitFor(() => {
         assertRendered();
         assertBtnHrefAttribute("/workflows/new");
      });

      expect(container).toMatchSnapshot();
   });

   it("requirePlanUpgrade false - size sm - test", async () => {
      const { container } = render(<CreateWorfklowButton size="sm" />);

      await waitFor(() => {
         assertRendered();
         assertBtnHrefAttribute("/workflows/new");
      });

      expect(container).toMatchSnapshot();
   });

   it("requirePlanUpgrade true - test", async () => {
      const { container } = render(
         <CreateWorfklowButton requirePlanUpgrade={true} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("CreateWorfklowButton functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      mockRouter.push("/");
   });

   it("requirePlanUpgrade false - btn clicked - test", async () => {
      render(<CreateWorfklowButton />);

      await waitFor(() => {
         assertRendered();
         expect(mockRouter.asPath).toEqual("/");
      });

      const btn = screen.getByTestId("create-workflow-btn");
      await userEvent.click(btn);

      await waitFor(() => {
         expect(mockRouter.asPath).toEqual("/workflows/new");
      });
   });

   it("requirePlanUpgrade true - btn clicked - test", async () => {
      render(<CreateWorfklowButton requirePlanUpgrade={true} />);

      await waitFor(() => {
         assertRendered();
         assertDialogNotRendered();
      });

      const btn = screen.getByTestId("create-workflow-btn");
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
