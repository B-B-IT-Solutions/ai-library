jest.mock("@/data/actions/template");
jest.mock("sonner");

import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument, dtestData } from "@tests";
import { toast } from "sonner";

import { getPublicPromptGenerationTemplateData } from "@/data/actions/template";

import { PublicUseTemplateButton } from "./use-template-button-public";

const toastMock = toast as jest.MockedFunction<typeof toast>;

const getPublicPromptGenerationTemplateDataMock =
   getPublicPromptGenerationTemplateData as jest.MockedFunction<
      typeof getPublicPromptGenerationTemplateData
   >;

const assertRendered = () => {
   const btn = screen.getByTestId("public-use-template-btn");
   assertInDocument(btn);
};

const assertDialogRendered = () => {
   const dialog = screen.getByTestId("use-template-dialog");
   assertInDocument(dialog);
};

const assertDialogNotRendered = () => {
   const dialog = screen.queryByTestId("use-template-dialog");
   assertNotInDocument(dialog);
};

describe("PublicUseTemplateButton rendering tests", () => {
   it("with fields - rendered test", async () => {
      const data = dtestData.dPromptGenerationData();
      getPublicPromptGenerationTemplateDataMock.mockResolvedValue(data);

      const descriptor = dtestData.dPrompt();
      const { container } = render(
         <PublicUseTemplateButton descriptor={descriptor} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("without fields - rendered test", async () => {
      const data = dtestData.dPromptGenerationData();
      data.allFields = [];
      getPublicPromptGenerationTemplateDataMock.mockResolvedValue(data);

      const descriptor = dtestData.dPrompt();
      const { container } = render(
         <PublicUseTemplateButton descriptor={descriptor} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("with className - rendered test", async () => {
      const data = dtestData.dPromptGenerationData();
      getPublicPromptGenerationTemplateDataMock.mockResolvedValue(data);

      const descriptor = dtestData.dPrompt();
      const { container } = render(
         <PublicUseTemplateButton
            descriptor={descriptor}
            className="custom-class"
         />
      );

      await waitFor(() => {
         assertRendered();
      });

      const btn = screen.getByTestId("public-use-template-btn");
      expect(btn).toHaveClass("custom-class");
      expect(container).toMatchSnapshot();
   });
});

describe("PublicUseTemplateButton functionality - tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("submit clicked - success - templateData null - test", async () => {
      getPublicPromptGenerationTemplateDataMock.mockResolvedValue(null);

      const descriptor = dtestData.dPrompt();

      render(<PublicUseTemplateButton descriptor={descriptor} />);

      await waitFor(() => {
         assertRendered();
      });

      const useTemplateBtn = screen.getByTestId("public-use-template-btn");
      await userEvent.click(useTemplateBtn);

      await waitFor(() => {
         assertDialogNotRendered();
      });

      expect(getPublicPromptGenerationTemplateDataMock).toHaveBeenCalledTimes(
         1
      );
      expect(getPublicPromptGenerationTemplateDataMock).toHaveBeenCalledWith(
         descriptor.id
      );
      expect(toastMock.error).toHaveBeenCalledTimes(1);
      expect(toastMock.error).toHaveBeenCalledWith(
         "Vorlage konnte nicht geladen werden"
      );
   });

   it("submit clicked - success - templateData retrieved - test", async () => {
      const data = dtestData.dPromptGenerationData();
      getPublicPromptGenerationTemplateDataMock.mockResolvedValue(data);

      const descriptor = dtestData.dPrompt();

      render(<PublicUseTemplateButton descriptor={descriptor} />);

      await waitFor(() => {
         assertRendered();
      });

      const createPromptBtn = screen.getByTestId("public-use-template-btn");
      await userEvent.click(createPromptBtn);

      await waitFor(() => {
         assertDialogRendered();
      });
   });

   it("close clicked- test", async () => {
      const data = dtestData.dPromptGenerationData();
      getPublicPromptGenerationTemplateDataMock.mockResolvedValue(data);

      const descriptor = dtestData.dPrompt();

      render(<PublicUseTemplateButton descriptor={descriptor} />);

      await waitFor(() => {
         assertRendered();
      });

      const createPromptBtn = screen.getByTestId("public-use-template-btn");
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
