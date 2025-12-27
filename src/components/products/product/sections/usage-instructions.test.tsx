import { getByTestId, screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument, assertNotInDocument, dtestData } from "@tests";

import { UsageInstructions } from "./usage-instructions";

const assertRendered = () => {
   const instructions = screen.getByTestId("usage-instructions");
   const instructionDivs = screen.getAllByTestId("instruction");
   const instruction1 = instructionDivs[0];
   const step = getByTestId(instruction1, "step");
   const title = getByTestId(instruction1, "title");
   const description = getByTestId(instruction1, "description");

   assertInDocument(instructions);
   assertInDocument(step);
   assertInDocument(title);
   assertInDocument(description);
   expect(instructionDivs).toHaveLength(3);
};

const assertNotRendered = () => {
   const instructions = screen.queryByTestId("usage-instructions");
   assertNotInDocument(instructions);
};

describe("UsageInstructions rendering tests", () => {
   it("UsageInstructions - instructions empty -  test", async () => {
      const product = dtestData.dProduct();
      product.instructions = [];

      const { container } = render(<UsageInstructions product={product} />);

      await waitFor(() => {
         assertNotRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("UsageInstructions - features defined -  test", async () => {
      const product = dtestData.dProduct();

      const { container } = render(<UsageInstructions product={product} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
