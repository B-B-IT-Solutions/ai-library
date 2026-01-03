jest.mock("@/data/actions/library");
jest.mock("sonner");

import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData } from "@tests";
import { toast } from "sonner";

import { downloadTemplate } from "@/data/actions/library";

import { DownloadTemplateButton } from "./download-template-button";

const toastMock = toast as jest.MockedFunction<typeof toast>;

const downloadTemplateMock = downloadTemplate as jest.MockedFunction<
   typeof downloadTemplate
>;

const assertRendered = () => {
   const createPromptBtn = screen.getByTestId("create-prompt-btn");
   assertInDocument(createPromptBtn);
};

describe("DownloadTemplateButton rendering tests", () => {
   it("DownloadTemplateButton rendered test", async () => {
      const descriptor = dtestData.dPromptTemplateDescriptor();
      const { container } = render(
         <DownloadTemplateButton descriptor={descriptor} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("DownloadTemplateButton functionality tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("DownloadTemplateButton - create prompt btn clicked - result.success true - test", async () => {
      const addResult = {
         success: true,
         message: "prompt created",
      };
      downloadTemplateMock.mockResolvedValue(addResult);

      const descriptor = dtestData.dPromptTemplateDescriptor();
      render(<DownloadTemplateButton descriptor={descriptor} />);

      await waitFor(() => {
         assertRendered();
         expect(downloadTemplateMock).not.toHaveBeenCalled();
      });

      const createPromptBtn = screen.getByTestId("create-prompt-btn");
      await userEvent.click(createPromptBtn);

      await waitFor(() => {
         expect(downloadTemplateMock).toHaveBeenCalledTimes(1);
         expect(downloadTemplateMock).toHaveBeenCalledWith(descriptor.id);
         expect(toastMock.success).toHaveBeenCalledTimes(1);
         expect(toastMock.success).toHaveBeenCalledWith(addResult.message);
      });
   });

   it("DownloadTemplateButton - create prompt btn clicked - result.success false - test", async () => {
      const addResult = {
         success: false,
         message: "prompt not created",
      };
      downloadTemplateMock.mockResolvedValue(addResult);

      const descriptor = dtestData.dPromptTemplateDescriptor();
      render(<DownloadTemplateButton descriptor={descriptor} />);

      await waitFor(() => {
         assertRendered();
         expect(downloadTemplateMock).not.toHaveBeenCalled();
      });

      const createPromptBtn = screen.getByTestId("create-prompt-btn");
      await userEvent.click(createPromptBtn);

      await waitFor(() => {
         expect(downloadTemplateMock).toHaveBeenCalledTimes(1);
         expect(downloadTemplateMock).toHaveBeenCalledWith(descriptor.id);
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(addResult.message);
      });
   });
});
