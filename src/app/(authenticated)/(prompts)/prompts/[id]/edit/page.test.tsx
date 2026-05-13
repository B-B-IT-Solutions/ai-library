jest.mock("@/data/actions/prompt");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderAsyncRSC } from "@tests";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import { getPrompt } from "@/data/actions/prompt";

import EditPromptPage, { metadata, PageProps } from "./page";

const getPromptMock = getPrompt as jest.MockedFunction<typeof getPrompt>;

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

   it("EditPromptPage - prompt not found - rendered test", async () => {
      getPromptMock.mockResolvedValue(null);

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

   it("EditPromptPage - prompt found - rendered test", async () => {
      const prompt = dtestData.dPrompt0();
      getPromptMock.mockResolvedValue(prompt);

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
   it("EditPromptPage - metadata - test", async () => {
      expect(metadata).toEqual(expectedMetadata);
   });
});
