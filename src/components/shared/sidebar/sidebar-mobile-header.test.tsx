import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, renderWithSidebar } from "@tests";

import { SidebarMobileHeader } from "./sidebar-mobile-header";

const assertRendered = () => {
   const trigger = screen.getByTestId("sidebar-mobile-header");
   assertInDocument(trigger);
};

describe("MobileHeader rendering tests", () => {
   it("rendered - test", async () => {
      const { container } = renderWithSidebar(<SidebarMobileHeader />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
