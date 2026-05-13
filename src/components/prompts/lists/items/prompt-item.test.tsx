jest.mock("sonner");

import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData, renderWithRouter } from "@tests";
import mockRouter from "next-router-mock";

import { PromptItem } from "./prompt-item";

const assertRendered = () => {
   const listItem = screen.getByTestId("prompt-list-item");
   const viewBtn = screen.getByTestId("view-details-link-title");
   const categories = screen.getByTestId("categories");

   assertInDocument(listItem);
   assertInDocument(viewBtn);
   assertInDocument(categories);
};

describe("PromptItem rendering tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("PromptItem - categories empty - rendered test", async () => {
      const prompt = dtestData.dPrompt0();
      prompt.categories = [];

      const url = `/prompts/random-prompt-id-123`;
      const { container } = renderWithRouter(
         <PromptItem prompt={prompt} />,
         url
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("PromptItem - with categories - rendered test", async () => {
      const prompt = dtestData.dPrompt0();

      const url = `/prompts/${prompt.id}`;
      const { container } = renderWithRouter(
         <PromptItem prompt={prompt} />,
         url
      );
      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("PromptItem functionality tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
      mockRouter.push("/");
   });

   it("PromptItem - view btn clicked - test", async () => {
      const prompt = dtestData.dPrompt0();

      const url = "/prompts";
      renderWithRouter(<PromptItem prompt={prompt} />, url);

      await waitFor(() => {
         assertRendered();
         expect(mockRouter.pathname).toEqual(url);
      });

      const viewBtn = screen.getByTestId("view-details-link-title");
      await userEvent.click(viewBtn);

      await waitFor(() => {
         expect(mockRouter.pathname).toEqual(`/prompts/${prompt.id}`);
      });
   });
});
