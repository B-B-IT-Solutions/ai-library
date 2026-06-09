jest.mock("@/data/actions/prompt");
jest.mock("sonner");

import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument, dtestData } from "@tests";
import { toast } from "sonner";

import { getPromptGenerationData } from "@/data/actions/prompt";

import { UsePromptButton } from "./use-prompt-button";

const toastMock = toast as jest.MockedFunction<typeof toast>;

const getPromptGenerationDataMock =
   getPromptGenerationData as jest.MockedFunction<
      typeof getPromptGenerationData
   >;

const assertRendered = () => {
   const btn = screen.getByTestId("use-prompt-btn");
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

describe("UsePromptButton rendering tests", () => {
   it("with fields - rendered test", async () => {
      const data = dtestData.dPromptGenerationData();
      getPromptGenerationDataMock.mockResolvedValue(data);

      const descriptor = dtestData.dPrompt();
      const { container } = render(<UsePromptButton descriptor={descriptor} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("without fields - rendered test", async () => {
      const data = dtestData.dPromptGenerationData();
      data.allFields = [];
      getPromptGenerationDataMock.mockResolvedValue(data);

      const descriptor = dtestData.dPrompt();
      const { container } = render(<UsePromptButton descriptor={descriptor} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("with className - rendered test", async () => {
      const data = dtestData.dPromptGenerationData();
      getPromptGenerationDataMock.mockResolvedValue(data);

      const descriptor = dtestData.dPrompt();
      const { container } = render(
         <UsePromptButton descriptor={descriptor} className="custom-class" />
      );

      await waitFor(() => {
         assertRendered();
      });

      const btn = screen.getByTestId("use-prompt-btn");
      expect(btn).toHaveClass("custom-class");
      expect(container).toMatchSnapshot();
   });
});

describe("UsePromptButton functionality - tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("submit clicked - success - templateData null - test", async () => {
      getPromptGenerationDataMock.mockResolvedValue(null);

      const descriptor = dtestData.dPrompt();

      render(<UsePromptButton descriptor={descriptor} />);

      await waitFor(() => {
         assertRendered();
      });

      const useTemplateBtn = screen.getByTestId("use-prompt-btn");
      await userEvent.click(useTemplateBtn);

      await waitFor(() => {
         assertDialogNotRendered();
      });

      expect(getPromptGenerationDataMock).toHaveBeenCalledTimes(1);
      expect(getPromptGenerationDataMock).toHaveBeenCalledWith(descriptor.id);
      expect(toastMock.error).toHaveBeenCalledTimes(1);
      expect(toastMock.error).toHaveBeenCalledWith(
         "Vorlage konnte nicht geladen werden"
      );
   });

   it("submit clicked - success - templateData retrieved - test", async () => {
      const data = dtestData.dPromptGenerationData();
      getPromptGenerationDataMock.mockResolvedValue(data);

      const descriptor = dtestData.dPrompt();

      render(<UsePromptButton descriptor={descriptor} />);

      await waitFor(() => {
         assertRendered();
      });

      const createPromptBtn = screen.getByTestId("use-prompt-btn");
      await userEvent.click(createPromptBtn);

      await waitFor(() => {
         assertDialogRendered();
      });
   });

   it("close clicked- test", async () => {
      const data = dtestData.dPromptGenerationData();
      getPromptGenerationDataMock.mockResolvedValue(data);

      const descriptor = dtestData.dPrompt();

      render(<UsePromptButton descriptor={descriptor} />);

      await waitFor(() => {
         assertRendered();
      });

      const createPromptBtn = screen.getByTestId("use-prompt-btn");
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
