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
   const downloadMenuItem = screen.getByTestId("download-template-menu-item");
   assertInDocument(downloadMenuItem);
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

   it("DownloadTemplateButton - download template btn clicked - result.success true - test", async () => {
      const addResult = {
         success: true,
         message: "data ready",
         data: "prompt template text",
      };
      downloadTemplateMock.mockResolvedValue(addResult);

      const descriptor = dtestData.dPromptTemplateDescriptor();
      render(<DownloadTemplateButton descriptor={descriptor} />);

      await waitFor(() => {
         assertRendered();
         expect(downloadTemplateMock).not.toHaveBeenCalled();
      });

      const menuItem = screen.getByTestId("download-template-menu-item");
      await userEvent.click(menuItem);

      await waitFor(() => {
         expect(downloadTemplateMock).toHaveBeenCalledTimes(1);
         expect(downloadTemplateMock).toHaveBeenCalledWith(descriptor.id);
         expect(toastMock.success).toHaveBeenCalledTimes(1);
         expect(toastMock.success).toHaveBeenCalledWith(addResult.message);
      });
   });

   it("DownloadTemplateButton - download template btn clicked - result.success false - test", async () => {
      const addResult = {
         success: false,
         message: "template cannot be downloaded",
      };
      downloadTemplateMock.mockResolvedValue(addResult);

      const descriptor = dtestData.dPromptTemplateDescriptor();
      render(<DownloadTemplateButton descriptor={descriptor} />);

      await waitFor(() => {
         assertRendered();
         expect(downloadTemplateMock).not.toHaveBeenCalled();
      });

      const menuItem = screen.getByTestId("download-template-menu-item");
      await userEvent.click(menuItem);

      await waitFor(() => {
         expect(downloadTemplateMock).toHaveBeenCalledTimes(1);
         expect(downloadTemplateMock).toHaveBeenCalledWith(descriptor.id);
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(addResult.message);
      });
   });
});
