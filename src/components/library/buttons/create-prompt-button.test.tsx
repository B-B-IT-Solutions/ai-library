jest.mock("@/data/actions/library");
jest.mock("@/data/actions/prompt");
jest.mock("sonner");

import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument, dtestData } from "@tests";
import { toast } from "sonner";

import { composePromptFromTemplate } from "@/data/actions/library";
import { getPromptGenerationTemplateData } from "@/data/actions/prompt";
import { DPromptUpdate } from "@/data/types/domain/prompt";
import { DPromptTemplateFieldValues } from "@/data/types/domain/prompt.template";
import { ActionResult } from "@/data/types/utils";

import { CreatePromptButton } from "./create-prompt-button";

const toastMock = toast as jest.MockedFunction<typeof toast>;

const composePromptFromTemplateMock =
   composePromptFromTemplate as jest.MockedFunction<
      typeof composePromptFromTemplate
   >;

const getPromptGenerationTemplateDataMock =
   getPromptGenerationTemplateData as jest.MockedFunction<
      typeof getPromptGenerationTemplateData
   >;

const assertRendered = () => {
   const createPromptBtn = screen.getByTestId("create-prompt-btn");
   assertInDocument(createPromptBtn);
};

describe("CreatePromptButton rendering tests", () => {
   it("CreatePromptButton - with fields - rendered test", async () => {
      const data = dtestData.dPromptTemplateDataPromptGeneration();
      getPromptGenerationTemplateDataMock.mockResolvedValue(data);

      const descriptor = dtestData.dPromptTemplateDescriptorWithTemplate();
      const { container } = render(
         <CreatePromptButton descriptor={descriptor} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("CreatePromptButton - without fields - rendered test", async () => {
      const data = dtestData.dPromptTemplateDataPromptGeneration();
      data.template.fields = [];
      data.globalFields = [];
      getPromptGenerationTemplateDataMock.mockResolvedValue(data);

      const descriptor = dtestData.dPromptTemplateDescriptorWithTemplate();
      const { container } = render(
         <CreatePromptButton descriptor={descriptor} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("CreatePromptButton - with className - rendered test", async () => {
      const data = dtestData.dPromptTemplateDataPromptGeneration();
      getPromptGenerationTemplateDataMock.mockResolvedValue(data);

      const descriptor = dtestData.dPromptTemplateDescriptorWithTemplate();
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

describe("CreatePromptButton functionality - no fields - tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("CreatePromptButton - submit clicked - success - data null - test", async () => {
      getPromptGenerationTemplateDataMock.mockResolvedValue(null);

      const promptUpdate = dtestData.dPromptUpdate();
      const result: ActionResult<DPromptUpdate> = {
         success: true,
         message: "Prompt erfolgreich generiert",
         data: promptUpdate,
      };
      composePromptFromTemplateMock.mockResolvedValue(result);

      const descriptor = dtestData.dPromptTemplateDescriptorWithTemplate();

      render(<CreatePromptButton descriptor={descriptor} />);

      await waitFor(() => {
         assertRendered();
         expect(composePromptFromTemplateMock).not.toHaveBeenCalled();
      });

      const createPromptBtn = screen.getByTestId("create-prompt-btn");
      await userEvent.click(createPromptBtn);

      expect(composePromptFromTemplateMock).toHaveBeenCalledTimes(1);
      expect(composePromptFromTemplateMock).toHaveBeenCalledWith(
         descriptor.id,
         {}
      );
   });

   it("CreatePromptButton - submit clicked - success - test", async () => {
      const data = dtestData.dPromptTemplateDataPromptGeneration();
      data.template.fields = [];
      data.globalFields = [];
      getPromptGenerationTemplateDataMock.mockResolvedValue(data);

      const promptUpdate = dtestData.dPromptUpdate();
      const result: ActionResult<DPromptUpdate> = {
         success: true,
         message: "Prompt erfolgreich generiert",
         data: promptUpdate,
      };
      composePromptFromTemplateMock.mockResolvedValue(result);

      const descriptor = dtestData.dPromptTemplateDescriptorWithTemplate();

      render(<CreatePromptButton descriptor={descriptor} />);

      await waitFor(() => {
         assertRendered();
         expect(composePromptFromTemplateMock).not.toHaveBeenCalled();
      });

      const createPromptBtn = screen.getByTestId("create-prompt-btn");
      await userEvent.click(createPromptBtn);

      expect(composePromptFromTemplateMock).toHaveBeenCalledTimes(1);
      expect(composePromptFromTemplateMock).toHaveBeenCalledWith(
         descriptor.id,
         {}
      );
   });

   it("CreatePromptButton - submit clicked - error - test", async () => {
      const data = dtestData.dPromptTemplateDataPromptGeneration();
      data.template.fields = [];
      data.globalFields = [];
      getPromptGenerationTemplateDataMock.mockResolvedValue(data);

      const result: ActionResult<DPromptUpdate> = {
         success: false,
         message: "Template not found",
      };
      composePromptFromTemplateMock.mockResolvedValue(result);

      const descriptor = dtestData.dPromptTemplateDescriptorWithTemplate();

      render(<CreatePromptButton descriptor={descriptor} />);

      await waitFor(() => {
         assertRendered();
         expect(composePromptFromTemplateMock).not.toHaveBeenCalled();
      });

      const createPromptBtn = screen.getByTestId("create-prompt-btn");
      await userEvent.click(createPromptBtn);

      expect(composePromptFromTemplateMock).toHaveBeenCalledTimes(1);
      expect(composePromptFromTemplateMock).toHaveBeenCalledWith(
         descriptor.id,
         {}
      );
      expect(toastMock.error).toHaveBeenCalledTimes(1);
      expect(toastMock.error).toHaveBeenCalledWith(result.message);
   });
});

describe("CreatePromptButton functionality - with fields - tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("CreatePromptButton - submit clicked - success - test", async () => {
      const data = dtestData.dPromptTemplateDataPromptGeneration();
      getPromptGenerationTemplateDataMock.mockResolvedValue(data);

      const promptData = dtestData.dPromptUpdate();
      const result: ActionResult<DPromptUpdate> = {
         success: true,
         message: "Prompt erfolgreich generiert",
         data: promptData,
      };
      composePromptFromTemplateMock.mockResolvedValue(result);

      const descriptor = dtestData.dPromptTemplateDescriptorWithTemplate();

      render(<CreatePromptButton descriptor={descriptor} />);

      await waitFor(() => {
         assertRendered();
      });

      const createPromptBtn = screen.getByTestId("create-prompt-btn");
      await userEvent.click(createPromptBtn);

      await waitFor(() => {
         const dialog = screen.getByTestId("template-fields-form");
         assertInDocument(dialog);
         expect(composePromptFromTemplateMock).not.toHaveBeenCalled();
      });

      const submitBtn = screen.getByTestId("submit-btn");
      await userEvent.click(submitBtn);

      const expectedValues: DPromptTemplateFieldValues = {
         field_0: "option 1",
         field_1: "option 1",
         field_2: "option 1",
         name_0: "defaultValue-0",
         name_1: "defaultValue-1",
         name_2: "defaultValue-2",
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

   it("CreatePromptButton - submit clicked - error - test", async () => {
      const data = dtestData.dPromptTemplateDataPromptGeneration();
      getPromptGenerationTemplateDataMock.mockResolvedValue(data);

      const result: ActionResult<DPromptUpdate> = {
         success: false,
         message: "Provided template fields are invalid",
      };
      composePromptFromTemplateMock.mockResolvedValue(result);

      const descriptor = dtestData.dPromptTemplateDescriptorWithTemplate();

      render(<CreatePromptButton descriptor={descriptor} />);

      await waitFor(() => {
         assertRendered();
      });

      const createPromptBtn = screen.getByTestId("create-prompt-btn");
      await userEvent.click(createPromptBtn);

      await waitFor(() => {
         const dialog = screen.getByTestId("template-fields-form");
         assertInDocument(dialog);
         expect(composePromptFromTemplateMock).not.toHaveBeenCalled();
      });

      const submitBtn = screen.getByTestId("submit-btn");
      await userEvent.click(submitBtn);

      const expectedValues: DPromptTemplateFieldValues = {
         field_0: "option 1",
         field_1: "option 1",
         field_2: "option 1",
         name_0: "defaultValue-0",
         name_1: "defaultValue-1",
         name_2: "defaultValue-2",
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
   });

   it("CreatePromptButton - cancel clicked- test", async () => {
      const data = dtestData.dPromptTemplateDataPromptGeneration();
      getPromptGenerationTemplateDataMock.mockResolvedValue(data);

      const descriptor = dtestData.dPromptTemplateDescriptorWithTemplate();

      render(<CreatePromptButton descriptor={descriptor} />);

      await waitFor(() => {
         assertRendered();
      });

      const createPromptBtn = screen.getByTestId("create-prompt-btn");
      await userEvent.click(createPromptBtn);

      await waitFor(() => {
         const dialog = screen.getByTestId("template-fields-form");
         assertInDocument(dialog);
      });

      const cancelBtn = screen.getByTestId("cancel-btn");
      await userEvent.click(cancelBtn);

      await waitFor(() => {
         const dialog = screen.queryByTestId("template-fields-form");
         assertNotInDocument(dialog);
      });
   });
});
