jest.mock("@/data/actions/prompt/prompt.actions");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderAsyncRSC } from "@tests";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import { getPrompt } from "@/data/actions/prompt/prompt.actions";

import PromptPage, { metadata, PromptPageProps } from "./page";

const getPromptMock = getPrompt as jest.MockedFunction<typeof getPrompt>;

const notFoundMock = notFound as jest.MockedFunction<typeof notFound>;

export const expectedMetadata: Metadata = {
   title: "Prompt",
};

const assertRendered = () => {
   const page = screen.getByTestId("prompt-page");

   assertInDocument(page);
};

describe("PromptPage rendering tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("PromptPage - prompt not found - rendered test", async () => {
      getPromptMock.mockResolvedValue(undefined);

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

   it("PromptPage - prompt found -rendered test", async () => {
      const prompt = dtestData.dPrompt();
      getPromptMock.mockResolvedValue(prompt);

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
   it("PromptPage - metadata - test", async () => {
      expect(metadata).toEqual(expectedMetadata);
   });
});
