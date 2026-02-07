jest.mock("@/data/actions/library");
jest.mock("sonner");

import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData } from "@tests";
import { toast } from "sonner";

import { composePromptFromTemplate } from "@/data/actions/library";
import { DPromptTemplateFieldValues } from "@/data/types/domain/prompt.template";

import { CreatePromptButton } from "./create-prompt-button-with-fields";

const toastMock = toast as jest.MockedFunction<typeof toast>;

const composePromptFromTemplateMock =
   composePromptFromTemplate as jest.MockedFunction<
      typeof composePromptFromTemplate
   >;

const assertRendered = () => {
   const createPromptBtn = screen.getByTestId("create-prompt-btn");
   assertInDocument(createPromptBtn);
};

describe("CreatePromptButton rendering tests", () => {
   it("CreatePromptButton - with fields - rendered test", async () => {
      const descriptor = dtestData.dPromptTemplateDescriptorWithPrompt();
      const { container } = render(
         <CreatePromptButton descriptor={descriptor} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("CreatePromptButton - without fields - rendered test", async () => {
      const descriptor = dtestData.dPromptTemplateDescriptorWithPrompt();
      descriptor.promptTemplate.fields = [];
      const { container } = render(
         <CreatePromptButton descriptor={descriptor} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("CreatePromptButton - with className - rendered test", async () => {
      const descriptor = dtestData.dPromptTemplateDescriptorWithPrompt();
      const { container } = render(
         <CreatePromptButton descriptor={descriptor} className="custom-class" />
      );

      await waitFor(() => {
         assertRendered();
      });

      const button = screen.getByTestId("create-prompt-btn");
      expect(button).toHaveClass("custom-class");
      expect(container).toMatchSnapshot();
   });
});

describe("CreatePromptButton functionality - no fields tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("CreatePromptButton - no fields - button clicked - success - test", async () => {
      const promptData = dtestData.dPromptUpdate();
      const result = {
         success: true,
         message: "Prompt erfolgreich generiert",
         data: promptData,
      };
      composePromptFromTemplateMock.mockResolvedValue(result);

      const descriptor = dtestData.dPromptTemplateDescriptorWithPrompt();
      descriptor.promptTemplate.fields = [];

      render(<CreatePromptButton descriptor={descriptor} />);

      await waitFor(() => {
         assertRendered();
         expect(composePromptFromTemplateMock).not.toHaveBeenCalled();
      });

      const createPromptBtn = screen.getByTestId("create-prompt-btn");
      await userEvent.click(createPromptBtn);

      await waitFor(() => {
         expect(composePromptFromTemplateMock).toHaveBeenCalledTimes(1);
         expect(composePromptFromTemplateMock).toHaveBeenCalledWith(
            descriptor.id,
            {}
         );
      });
   });

   it("CreatePromptButton - no fields - button clicked - error - test", async () => {
      const result = {
         success: false,
         message: "Template not found",
      };
      composePromptFromTemplateMock.mockResolvedValue(result);

      const descriptor = dtestData.dPromptTemplateDescriptorWithPrompt();
      descriptor.promptTemplate.fields = [];

      render(<CreatePromptButton descriptor={descriptor} />);

      await waitFor(() => {
         assertRendered();
         expect(composePromptFromTemplateMock).not.toHaveBeenCalled();
      });

      const createPromptBtn = screen.getByTestId("create-prompt-btn");
      await userEvent.click(createPromptBtn);

      await waitFor(() => {
         expect(composePromptFromTemplateMock).toHaveBeenCalledTimes(1);
         expect(composePromptFromTemplateMock).toHaveBeenCalledWith(
            descriptor.id,
            {}
         );
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(result.message);
      });
   });
});

describe("CreatePromptButton functionality - with fields tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("CreatePromptButton - with fields - button clicked - opens fields-form dialog - test", async () => {
      const descriptor = dtestData.dPromptTemplateDescriptorWithPrompt();

      render(<CreatePromptButton descriptor={descriptor} />);

      await waitFor(() => {
         assertRendered();
         expect(composePromptFromTemplateMock).not.toHaveBeenCalled();
      });

      const createPromptBtn = screen.getByTestId("create-prompt-btn");
      await userEvent.click(createPromptBtn);

      await waitFor(() => {
         const dialog = screen.getByTestId("create-prompt-dialog-fields-form");
         assertInDocument(dialog);
         expect(composePromptFromTemplateMock).not.toHaveBeenCalled();
      });
   });

   it("CreatePromptButton - fields-form dialog - submit with values - success - test", async () => {
      const promptData = dtestData.dPromptUpdate();
      const result = {
         success: true,
         message: "Prompt erfolgreich generiert",
         data: promptData,
      };
      composePromptFromTemplateMock.mockResolvedValue(result);

      const descriptor = dtestData.dPromptTemplateDescriptorWithPrompt();

      render(<CreatePromptButton descriptor={descriptor} />);

      await waitFor(() => {
         assertRendered();
      });

      const createPromptBtn = screen.getByTestId("create-prompt-btn");
      await userEvent.click(createPromptBtn);

      await waitFor(() => {
         const dialog = screen.getByTestId("create-prompt-dialog-fields-form");
         assertInDocument(dialog);
      });

      const submitBtn = screen.getByTestId("dialog-submit-btn");
      await userEvent.click(submitBtn);

      const expectedValues: DPromptTemplateFieldValues = {
         "field 0": "option 1",
         "field 1": "option 1",
         "field 2": "option 1",
      };
      expect(composePromptFromTemplateMock).toHaveBeenCalledTimes(1);
      expect(composePromptFromTemplateMock).toHaveBeenCalledWith(
         descriptor.id,
         expectedValues
      );

      await waitFor(() => {
         const reviewDialog = screen.getByTestId("prompt-edit");
         assertInDocument(reviewDialog);
      });
   });

   it("CreatePromptButton - fields-form dialog - submit with values - error - test", async () => {
      const result = {
         success: false,
         message: "Provided template fields are invalid",
      };
      composePromptFromTemplateMock.mockResolvedValue(result);

      const descriptor = dtestData.dPromptTemplateDescriptorWithPrompt();

      render(<CreatePromptButton descriptor={descriptor} />);

      await waitFor(() => {
         assertRendered();
      });

      const createPromptBtn = screen.getByTestId("create-prompt-btn");
      await userEvent.click(createPromptBtn);

      await waitFor(() => {
         const dialog = screen.getByTestId("create-prompt-dialog-fields-form");
         assertInDocument(dialog);
      });

      const submitBtn = screen.getByTestId("dialog-submit-btn");
      await userEvent.click(submitBtn);

      const expectedValues: DPromptTemplateFieldValues = {
         "field 0": "option 1",
         "field 1": "option 1",
         "field 2": "option 1",
      };
      await waitFor(() => {
         expect(composePromptFromTemplateMock).toHaveBeenCalledTimes(1);
         expect(composePromptFromTemplateMock).toHaveBeenCalledWith(
            descriptor.id,
            expectedValues
         );
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(result.message);
      });

      // Should still be in fields-form mode
      await waitFor(() => {
         const dialog = screen.getByTestId("create-prompt-dialog-fields-form");
         assertInDocument(dialog);
      });
   });

   it("CreatePromptButton - fields-form dialog - cancel - test", async () => {
      const descriptor = dtestData.dPromptTemplateDescriptorWithPrompt();

      render(<CreatePromptButton descriptor={descriptor} />);

      await waitFor(() => {
         assertRendered();
      });

      const createPromptBtn = screen.getByTestId("create-prompt-btn");
      await userEvent.click(createPromptBtn);

      await waitFor(() => {
         const dialog = screen.getByTestId("create-prompt-dialog-fields-form");
         assertInDocument(dialog);
      });

      const cancelBtn = screen.getByTestId("dialog-cancel-btn");
      await userEvent.click(cancelBtn);

      await waitFor(() => {
         expect(
            screen.queryByTestId("create-prompt-dialog-fields-form")
         ).not.toBeInTheDocument();
         expect(screen.queryByTestId("prompt-edit")).not.toBeInTheDocument();
      });
   });

   it("CreatePromptButton - review dialog - cancel - test", async () => {
      const promptData = dtestData.dPromptUpdate();
      const result = {
         success: true,
         message: "Prompt erfolgreich generiert",
         data: promptData,
      };
      composePromptFromTemplateMock.mockResolvedValue(result);

      const descriptor = dtestData.dPromptTemplateDescriptorWithPrompt();

      render(<CreatePromptButton descriptor={descriptor} />);

      await waitFor(() => {
         assertRendered();
      });

      const createPromptBtn = screen.getByTestId("create-prompt-btn");
      await userEvent.click(createPromptBtn);

      await waitFor(() => {
         const dialog = screen.getByTestId("create-prompt-dialog-fields-form");
         assertInDocument(dialog);
      });

      const submitBtn = screen.getByTestId("dialog-submit-btn");
      await userEvent.click(submitBtn);

      await waitFor(() => {
         const reviewDialog = screen.getByTestId("prompt-edit");
         assertInDocument(reviewDialog);
      });
   });
});

describe("CreatePromptButton button states tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("CreatePromptButton - shows Plus icon and text when not pending - test", async () => {
      const descriptor = dtestData.dPromptTemplateDescriptorWithPrompt();

      render(<CreatePromptButton descriptor={descriptor} />);

      await waitFor(() => {
         assertRendered();
      });

      const button = screen.getByTestId("create-prompt-btn");
      expect(button).toHaveTextContent("Prompt erstellen");
      expect(button).not.toBeDisabled();
   });

   it("CreatePromptButton - shows Loader icon and disabled state when pending - test", async () => {
      const promptData = dtestData.dPromptUpdate();
      const result = {
         success: true,
         message: "Prompt erfolgreich generiert",
         data: promptData,
      };

      // Create a promise that we can control
      let resolvePromise: any;
      const pendingPromise = new Promise<typeof result>((resolve) => {
         resolvePromise = resolve;
      });

      composePromptFromTemplateMock.mockReturnValue(pendingPromise);

      const descriptor = dtestData.dPromptTemplateDescriptorWithPrompt();
      descriptor.promptTemplate.fields = [];

      render(<CreatePromptButton descriptor={descriptor} />);

      await waitFor(() => {
         assertRendered();
      });

      const button = screen.getByTestId("create-prompt-btn");
      await userEvent.click(button);

      // Button should be disabled and show loading state
      await waitFor(() => {
         expect(button).toBeDisabled();
         expect(button).toHaveTextContent("Erstellen...");
      });

      // Resolve the promise
      resolvePromise(result);

      // Wait for button to be enabled again
      await waitFor(() => {
         expect(button).not.toBeDisabled();
         expect(button).toHaveTextContent("Prompt erstellen");
      });
   });
});
