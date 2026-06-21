jest.mock("@/data/actions/prompt");
jest.mock("sonner");

import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument, dtestData } from "@tests";
import { toast } from "sonner";

import { getPublicPromptGenerationData } from "@/data/actions/prompt";

import { PublicUsePromptButton } from "./use-prompt-button-public";

const toastMock = toast as jest.MockedFunction<typeof toast>;

const getPublicPromptGenerationDataMock =
   getPublicPromptGenerationData as jest.MockedFunction<
      typeof getPublicPromptGenerationData
   >;

const assertRendered = () => {
   const btn = screen.getByTestId("public-use-prompt-btn");
   assertInDocument(btn);
};

const assertDialogRendered = () => {
   const dialog = screen.getByTestId("use-prompt-dialog");
   assertInDocument(dialog);
};

const assertDialogNotRendered = () => {
   const dialog = screen.queryByTestId("use-prompt-dialog");
   assertNotInDocument(dialog);
};

describe("PublicUsePromptButton rendering tests", () => {
   it("with fields - rendered test", async () => {
      const data = dtestData.dPromptTemplatingData();
      getPublicPromptGenerationDataMock.mockResolvedValue(data);

      const prompt = dtestData.dPrompt();
      const { container } = render(<PublicUsePromptButton prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("without fields - rendered test", async () => {
      const data = dtestData.dPromptTemplatingData();
      data.allFields = [];
      getPublicPromptGenerationDataMock.mockResolvedValue(data);

      const prompt = dtestData.dPrompt();
      const { container } = render(<PublicUsePromptButton prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("with className - rendered test", async () => {
      const data = dtestData.dPromptTemplatingData();
      getPublicPromptGenerationDataMock.mockResolvedValue(data);

      const prompt = dtestData.dPrompt();
      const { container } = render(
         <PublicUsePromptButton prompt={prompt} className="custom-class" />
      );

      await waitFor(() => {
         assertRendered();
      });

      const btn = screen.getByTestId("public-use-prompt-btn");
      expect(btn).toHaveClass("custom-class");
      expect(container).toMatchSnapshot();
   });
});

describe("PublicUsePromptButton functionality - tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("submit clicked - success - templateData null - test", async () => {
      getPublicPromptGenerationDataMock.mockResolvedValue(null);

      const prompt = dtestData.dPrompt();

      render(<PublicUsePromptButton prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
      });

      const useTemplateBtn = screen.getByTestId("public-use-prompt-btn");
      await userEvent.click(useTemplateBtn);

      await waitFor(() => {
         assertDialogNotRendered();
      });

      expect(getPublicPromptGenerationDataMock).toHaveBeenCalledTimes(1);
      expect(getPublicPromptGenerationDataMock).toHaveBeenCalledWith(prompt.id);
      expect(toastMock.error).toHaveBeenCalledTimes(1);
      expect(toastMock.error).toHaveBeenCalledWith(
         "Vorlage konnte nicht geladen werden"
      );
   });

   it("submit clicked - success - templateData retrieved - test", async () => {
      const data = dtestData.dPromptTemplatingData();
      getPublicPromptGenerationDataMock.mockResolvedValue(data);

      const prompt = dtestData.dPrompt();

      render(<PublicUsePromptButton prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
      });

      const createPromptBtn = screen.getByTestId("public-use-prompt-btn");
      await userEvent.click(createPromptBtn);

      await waitFor(() => {
         assertDialogRendered();
      });
   });

   it("close clicked- test", async () => {
      const data = dtestData.dPromptTemplatingData();
      getPublicPromptGenerationDataMock.mockResolvedValue(data);

      const prompt = dtestData.dPrompt();

      render(<PublicUsePromptButton prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
      });

      const createPromptBtn = screen.getByTestId("public-use-prompt-btn");
      await userEvent.click(createPromptBtn);

      await waitFor(() => {
         assertDialogRendered();
      });

      const closeBtn = screen.getByTestId("close-btn");
      await userEvent.click(closeBtn);

      await waitFor(() => {
         assertDialogNotRendered();
      });
   });
});
