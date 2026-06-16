import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument, dtestData } from "@tests";

import { PublicPromptView } from "./prompt-view-public";

const assertRendered = () => {
   const view = screen.getByTestId("public-prompt-view");
   const breadcrumb = screen.getByTestId("template-breadcrumb");
   const form = screen.getByTestId("template-view-form");
   const sidebar = screen.getByTestId("prompt-sidebar-public");

   assertInDocument(view);
   assertInDocument(breadcrumb);
   assertInDocument(form);
   assertInDocument(sidebar);
};

describe("PublicPromptView rendering tests", () => {
   it("collection undefined - test", async () => {
      const prompt = dtestData.dPromptWithContent();

      const { container } = render(
         <PublicPromptView prompt={prompt} collection={undefined} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("collection defined - test", async () => {
      const prompt = dtestData.dPromptWithContent();
      const collection = dtestData.dCollection();

      const { container } = render(
         <PublicPromptView prompt={prompt} collection={collection} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
