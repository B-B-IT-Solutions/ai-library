jest.mock("@/data/actions/library");
jest.mock("sonner");

import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData } from "@tests";
import { toast } from "sonner";

import { createPromptFromTemplate } from "@/data/actions/library";

import { CreatePromptButton } from "./create-prompt-button";

const toastMock = toast as jest.MockedFunction<typeof toast>;

const createPromptFromTemplateMock =
   createPromptFromTemplate as jest.MockedFunction<
      typeof createPromptFromTemplate
   >;

const assertRendered = () => {
   const createPromptBtn = screen.getByTestId("create-prompt-btn");
   assertInDocument(createPromptBtn);
};

describe("CreatePromptButton rendering tests", () => {
   it("CreatePromptButton rendered test", async () => {
      const descriptor = dtestData.dPromptTemplateDescriptor();
      const { container } = render(
         <CreatePromptButton templateDescriptor={descriptor} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("CreatePromptButton functionality tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("CreatePromptButton - create prompt btn clicked - result.success true - test", async () => {
      const addResult = {
         success: true,
         message: "prompt created",
      };
      createPromptFromTemplateMock.mockResolvedValue(addResult);

      const descriptor = dtestData.dPromptTemplateDescriptor();
      render(<CreatePromptButton templateDescriptor={descriptor} />);

      await waitFor(() => {
         assertRendered();
         expect(createPromptFromTemplateMock).not.toHaveBeenCalled();
      });

      const createPromptBtn = screen.getByTestId("create-prompt-btn");
      await userEvent.click(createPromptBtn);

      await waitFor(() => {
         expect(createPromptFromTemplateMock).toHaveBeenCalledTimes(1);
         expect(createPromptFromTemplateMock).toHaveBeenCalledWith(
            descriptor.id
         );
         expect(toastMock.success).toHaveBeenCalledTimes(1);
         expect(toastMock.success).toHaveBeenCalledWith(addResult.message);
      });
   });

   it("CreatePromptButton - create prompt btn clicked - result.success false - test", async () => {
      const addResult = {
         success: false,
         message: "prompt not created",
      };
      createPromptFromTemplateMock.mockResolvedValue(addResult);

      const descriptor = dtestData.dPromptTemplateDescriptor();
      render(<CreatePromptButton templateDescriptor={descriptor} />);

      await waitFor(() => {
         assertRendered();
         expect(createPromptFromTemplateMock).not.toHaveBeenCalled();
      });

      const createPromptBtn = screen.getByTestId("create-prompt-btn");
      await userEvent.click(createPromptBtn);

      await waitFor(() => {
         expect(createPromptFromTemplateMock).toHaveBeenCalledTimes(1);
         expect(createPromptFromTemplateMock).toHaveBeenCalledWith(
            descriptor.id
         );
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(addResult.message);
      });
   });
});
