import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument } from "@tests";

import { UpgradePlanDialog } from "./upgrade-plan-dialog";

describe("UpgradePlanDialog rendering tests", () => {
   it("open false - dialog not visible - test", async () => {
      render(
         <UpgradePlanDialog
            open={false}
            onOpenChange={jest.fn()}
            feature="Vorlagen"
         />
      );

      await waitFor(() => {
         assertNotInDocument(screen.queryByTestId("upgrade-plan-dialog"));
      });
   });

   it("open true - dialog visible - test", async () => {
      const { container } = render(
         <UpgradePlanDialog
            open={true}
            onOpenChange={jest.fn()}
            feature="Vorlagen"
         />
      );

      await waitFor(() => {
         assertInDocument(screen.getByTestId("upgrade-plan-dialog"));
         expect(
            screen.getByTestId("upgrade-plan-dialog").textContent
         ).toContain("Vorlagen");
         assertInDocument(screen.getByTestId("upgrade-btn"));
         assertInDocument(screen.getByTestId("upgrade-dialog-cancel-btn"));
      });

      expect(container).toMatchSnapshot();
   });
});

describe("UpgradePlanDialog functionality tests", () => {
   it("cancel clicked - onOpenChange called with false - test", async () => {
      const onOpenChange = jest.fn();

      render(
         <UpgradePlanDialog
            open={true}
            onOpenChange={onOpenChange}
            feature="Vorlagen"
         />
      );

      await waitFor(() => {
         assertInDocument(screen.getByTestId("upgrade-plan-dialog"));
      });

      const cancelBtn = screen.getByTestId("upgrade-dialog-cancel-btn");
      await userEvent.click(cancelBtn);

      expect(onOpenChange).toHaveBeenCalledWith(false);
   });

   it("upgrade btn links to pricing page - test", async () => {
      render(
         <UpgradePlanDialog
            open={true}
            onOpenChange={jest.fn()}
            feature="Vorlagen"
         />
      );

      await waitFor(() => {
         const upgradeBtn = screen.getByTestId("upgrade-btn");
         expect(upgradeBtn).toHaveAttribute("href", "/subscription/pricing");
      });
   });
});
