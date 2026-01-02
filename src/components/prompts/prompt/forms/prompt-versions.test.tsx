import { render, screen, waitFor } from "@testing-library/react";
import { assertInDocument, dtestData } from "@tests";

import { PromptVersions } from "./prompt-versions";

const assertRendered = () => {
   const versions = screen.getByTestId("prompt-versions");
   assertInDocument(versions);
};

describe("PromptVersion rendering tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("PromptVersion rendered test", async () => {
      const prompt = dtestData.dPromptDescriptor();

      const { container } = render(<PromptVersions prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
