jest.mock("@/data/actions/prompt0");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderAsyncRSC } from "@tests";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import { getPrompt0 } from "@/data/actions/prompt0";

import PromptPage, { metadata, PromptPageProps } from "./page";

const getPrompt0Mock = getPrompt0 as jest.MockedFunction<typeof getPrompt0>;

const notFoundMock = notFound as jest.MockedFunction<typeof notFound>;

const expectedMetadata: Metadata = {
   title: "Prompt",
};

const assertRendered = () => {
   const page = screen.getByTestId("prompt-page");
   const promptView = screen.getByTestId("prompt-view");

   assertInDocument(page);
   assertInDocument(promptView);
};

describe("PromptPage rendering tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("prompt not found - test", async () => {
      getPrompt0Mock.mockResolvedValue(null);

      const params = { id: "prompt-1" };
      const props: PromptPageProps = {
         params: Promise.resolve(params),
      };

      const { container } = await renderAsyncRSC(PromptPage, props);

      await waitFor(() => {
         expect(notFoundMock).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });

   it("prompt found - test", async () => {
      const prompt = dtestData.dPrompt0();
      getPrompt0Mock.mockResolvedValue(prompt);

      const params = { id: "prompt-1" };
      const props: PromptPageProps = {
         params: Promise.resolve(params),
      };

      const { container } = await renderAsyncRSC(PromptPage, props);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("PromptPage functionality tests", () => {
   it("metadata - test", async () => {
      expect(metadata).toEqual(expectedMetadata);
   });
});
