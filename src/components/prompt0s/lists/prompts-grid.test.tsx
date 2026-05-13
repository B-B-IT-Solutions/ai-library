import { screen, waitFor } from "@testing-library/react";
import { assertInDocument, dtestData, renderWithReactQuery } from "@tests";

import { PromptsGrid } from "./prompts-grid";

const assertEmptyRendered = () => {
   const empty = screen.getByTestId("prompts-empty");
   assertInDocument(empty);
};

const assertRendered = () => {
   const prompts = screen.getByTestId("prompts-grid");
   assertInDocument(prompts);
};

describe("PromptsGrid rendering tests", () => {
   it("PromptsGrid - empty - test", async () => {
      const { container } = renderWithReactQuery(<PromptsGrid prompts={[]} />);

      await waitFor(() => {
         assertEmptyRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("PromptsGrid - with prompts - test", async () => {
      const prompts = dtestData.dPrompt0s();

      const { container } = renderWithReactQuery(
         <PromptsGrid prompts={prompts} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
