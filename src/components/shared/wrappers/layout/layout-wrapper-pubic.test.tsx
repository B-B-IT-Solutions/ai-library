import { render, screen } from "@testing-library/react";
import { assertInDocument } from "@tests";

import { Props, PublicLayoutWrapper } from "./layout-wrapper-pulbic";

const assertRendered = () => {
   const wrapper = screen.getByTestId("public-layout-wrapper");
   const test1 = screen.getByTestId("test-1");

   assertInDocument(wrapper);
   assertInDocument(test1);
};

describe("PublicLayoutWrapper rendering tests", () => {
   it("PublicLayoutWrapper - render - test", () => {
      const props: Props = {
         children: <div data-testid="test-1"></div>,
      };
      const { container } = render(<PublicLayoutWrapper {...props} />);

      assertRendered();

      expect(container).toMatchSnapshot();
   });
});
