jest.mock("@/components/shared/wrapper", () => ({
   PublicLayoutWrapper: ({ children }: { children: React.ReactNode }) => {
      return <div data-testid="public-layout-wrapper">{children}</div>;
   },
}));

import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument } from "@tests";

import { PublicLayout } from "./layout";

const assertRendered = () => {
   const wrapper = screen.getByTestId("public-layout-wrapper");
   const test1 = screen.getByTestId("test-1");

   assertInDocument(wrapper);
   assertInDocument(test1);
};

describe("PublicLayout rendering tests", () => {
   it("PublicLayout rendered", async () => {
      const { container } = render(
         <PublicLayout>
            <div data-testid="test-1"></div>
         </PublicLayout>
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
