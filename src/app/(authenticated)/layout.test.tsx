jest.mock("@/components/shared/wrappers/layout", () => ({
   AuthenticatedUserLayoutWrapper: ({
      children,
   }: {
      children: React.ReactNode;
   }) => {
      return (
         <div data-testid="authenticated-user-layout-wrapper">{children}</div>
      );
   },
}));

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, renderAsyncRSC } from "@tests";

import MainLayout from "./layout";

const assertRendered = () => {
   const wrapper = screen.getByTestId("authenticated-user-layout-wrapper");
   const test1 = screen.getByTestId("test-1");

   assertInDocument(wrapper);
   assertInDocument(test1);
};

describe("MainLayout rendering tests", () => {
   it("rendered - test", async () => {
      const { container } = await renderAsyncRSC(MainLayout, {
         children: <div data-testid="test-1"></div>,
      });

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
