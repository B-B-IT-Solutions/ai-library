jest.mock("@/components/shared/wrappers/layout", () => ({
   AuthenticatedAdminLayoutWrapper: ({
      children,
   }: {
      children: React.ReactNode;
   }) => {
      return (
         <div data-testid="authenticated-admin-layout-wrapper">{children}</div>
      );
   },
}));

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, renderAsyncRSC } from "@tests";

import { MainAdminLayout } from "./layout";

const assertRendered = () => {
   const wrapper = screen.getByTestId("authenticated-admin-layout-wrapper");
   const test1 = screen.getByTestId("test-1");

   assertInDocument(wrapper);
   assertInDocument(test1);
};

describe("MainAdminLayout rendering tests", () => {
   it("rendered - test", async () => {
      const { container } = await renderAsyncRSC(MainAdminLayout, {
         children: <div data-testid="test-1"></div>,
      });

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
