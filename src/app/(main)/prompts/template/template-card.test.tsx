jest.mock("@/lib/actions/prompt/prompt.actions");

import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument, dtestData } from "@tests";
import { Metadata } from "next";

import { TemplateCard } from "./template-card";

export const expectedMetadata: Metadata = {
   title: "Prompts",
};

const assertRendered = () => {
   const card = screen.getByTestId("template-card");
   const tags = screen.getByTestId("tags");
   const content = screen.getByTestId("content");

   assertInDocument(card);
   assertInDocument(tags);
   assertInDocument(content);
};

describe("TemplateCard rendering tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("TemplateCard rendered test", async () => {
      const template = dtestData.dPromptTemplate();

      const { container } = await render(
         <TemplateCard template={template} onSelect={jest.fn()} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
