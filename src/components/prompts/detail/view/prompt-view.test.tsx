import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument, dtestData } from "@tests";

import { DPromptVersionsResult } from "@/data/types/domain/prompt";

import { PromptView } from "./prompt-view";

const lockedVersionsResult: DPromptVersionsResult = { locked: true };

const assertRendered = () => {
   const libraryEntry = screen.getByTestId("prompt-view");
   const breadcrumb = screen.getByTestId("template-breadcrumb");
   const form = screen.getByTestId("template-view-form");
   const sidebar = screen.getByTestId("prompt-sidebar");

   assertInDocument(libraryEntry);
   assertInDocument(breadcrumb);
   assertInDocument(form);
   assertInDocument(sidebar);
};

describe("PromptView rendering tests", () => {
   it("collection undefined - test", async () => {
      const prompt = dtestData.dPromptWithContent();

      const { container } = render(
         <PromptView
            prompt={prompt}
            versionsResult={lockedVersionsResult}
            globalFields={[]}
         />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("collection defined - test", async () => {
      const prompt = dtestData.dPromptWithContent();
      const collection = dtestData.dCollectionPreview();

      const { container } = render(
         <PromptView
            prompt={prompt}
            currentCollection={collection}
            versionsResult={lockedVersionsResult}
            globalFields={[]}
         />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
