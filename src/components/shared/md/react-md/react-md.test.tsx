import { render, screen } from "@testing-library/react";
import { assertInDocument } from "@tests";

import { ReactMd } from "./react-md";

const assertRendered = () => {
   const renderer = screen.getByTestId("react-md");
   assertInDocument(renderer);
};

describe("ReactMd rendering tests", () => {
   it("ReactMd - classnem undefined - rendered test", () => {
      const { container } = render(<ReactMd> text 1</ReactMd>);

      assertRendered();

      expect(container).toMatchSnapshot();
   });

   it("ReactMd - classnem defined - rendered test", () => {
      const { container } = render(
         <ReactMd className="flex-1"> text 1</ReactMd>
      );

      assertRendered();

      expect(container).toMatchSnapshot();
   });
});
