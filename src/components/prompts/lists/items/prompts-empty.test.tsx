import { render, screen, waitFor } from "@testing-library/react";
import { assertInDocument } from "@tests";

import { PromtpsEmpty } from "./prompts-empty";

const assertPromptsEmptyRendered = () => {
   const empty = screen.getByTestId("prompts-empty");
   const btn = screen.getByTestId("create-prompt-btn");

   assertInDocument(empty);
   assertInDocument(btn);
};

const assertPromptsFilterEmptyRendered = () => {
   const empty = screen.getByTestId("prompts-filter-empty");
   assertInDocument(empty);
};

describe("PromtpsEmpty rendering tests", () => {
   it("hasActiveFilters true - test", async () => {
      const { container } = render(<PromtpsEmpty hasActiveFilters={true} />);

      await waitFor(() => {
         assertPromptsFilterEmptyRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("hasActiveFilters false - test", async () => {
      const { container } = render(<PromtpsEmpty hasActiveFilters={false} />);

      await waitFor(() => {
         assertPromptsEmptyRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
