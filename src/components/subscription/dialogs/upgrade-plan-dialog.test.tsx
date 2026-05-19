import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
   assertHasAttributeWithValue,
   assertInDocument,
   assertNotInDocument,
} from "@tests";
import mockRouter from "next-router-mock";

import { UpgradePlanDialog } from "./upgrade-plan-dialog";

const assertDialogRendered = () => {
   const dialog = screen.getByTestId("upgrade-plan-dialog");
   const upgradeBtn = screen.getByTestId("upgrade-btn");
   const cancelBtn = screen.getByTestId("cancel-btn");

   assertInDocument(dialog);
   assertInDocument(upgradeBtn);
   assertInDocument(cancelBtn);

   assertHasAttributeWithValue(upgradeBtn, "href", "/subscription/pricing");
};

const assertDialogNotRendered = () => {
   const dialog = screen.queryByTestId("upgrade-plan-dialog");
   assertNotInDocument(dialog);
};

describe("UpgradePlanDialog rendering tests", () => {
   it("open false - test", async () => {
      const { container } = render(
         <UpgradePlanDialog
            open={false}
            onOpenChange={jest.fn()}
            feature="Vorlagen"
         />
      );

      await waitFor(() => {
         assertDialogNotRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("open true - test", async () => {
      const { container } = render(
         <UpgradePlanDialog
            open={true}
            onOpenChange={jest.fn()}
            feature="Vorlagen"
         />
      );

      await waitFor(() => {
         assertDialogRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("UpgradePlanDialog functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      mockRouter.push("/");
   });

   it("upgrade btn clicked - test", async () => {
      render(
         <UpgradePlanDialog
            open={true}
            onOpenChange={jest.fn()}
            feature="Vorlagen"
         />
      );

      await waitFor(() => {
         assertDialogRendered();
         expect(mockRouter.asPath).toEqual("/");
      });

      const btn = screen.getByTestId("upgrade-btn");

      await userEvent.click(btn);

      await waitFor(() => {
         expect(mockRouter.asPath).toEqual("/subscription/pricing");
      });
   });

   it("cancel btn clicked - test", async () => {
      const onOpenChange = jest.fn();

      render(
         <UpgradePlanDialog
            open={true}
            onOpenChange={onOpenChange}
            feature="Vorlagen"
         />
      );

      await waitFor(() => {
         assertDialogRendered();
         expect(onOpenChange).not.toHaveBeenCalled();
      });

      const cancelBtn = screen.getByTestId("cancel-btn");
      await userEvent.click(cancelBtn);

      await waitFor(() => {
         expect(onOpenChange).toHaveBeenCalledTimes(1);
         expect(onOpenChange).toHaveBeenCalledWith(false);
      });
   });
});
