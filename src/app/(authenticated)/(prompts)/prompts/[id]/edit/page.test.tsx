jest.mock("@/data/actions/prompt0");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderAsyncRSC } from "@tests";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import { getPrompt0 } from "@/data/actions/prompt0";

import EditPromptPage, { metadata, PageProps } from "./page";

const getPrompt0Mock = getPrompt0 as jest.MockedFunction<typeof getPrompt0>;

const notFoundMock = notFound as jest.MockedFunction<typeof notFound>;

const expectedMetadata: Metadata = {
   title: "Prompt Bearbeiten",
};

const assertRendered = () => {
   const page = screen.getByTestId("prompt-edit-page");
   const promptEdit = screen.getByTestId("prompt-edit");

   assertInDocument(page);
   assertInDocument(promptEdit);
};

describe("EditPromptPage rendering tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("prompt not found - test", async () => {
      getPrompt0Mock.mockResolvedValue(null);

      const params = { id: "prompt-1" };
      const props: PageProps = {
         params: Promise.resolve(params),
      };

      const { container } = await renderAsyncRSC(EditPromptPage, props);

      await waitFor(() => {
         expect(notFoundMock).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });

   it("prompt found - test", async () => {
      const prompt = dtestData.dPrompt0();
      getPrompt0Mock.mockResolvedValue(prompt);

      const params = { id: "prompt-1" };
      const props: PageProps = {
         params: Promise.resolve(params),
      };

      const { container } = await renderAsyncRSC(EditPromptPage, props);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("EditPromptPage functionality tests", () => {
   it("metadata - test", async () => {
      expect(metadata).toEqual(expectedMetadata);
   });
});
