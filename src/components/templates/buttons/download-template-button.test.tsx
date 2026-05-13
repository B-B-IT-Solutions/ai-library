jest.mock("@/data/actions/template");
jest.mock("sonner");
jest.mock("file-saver");

import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData } from "@tests";
import { saveAs } from "file-saver";
import { toast } from "sonner";

import { downloadTemplate } from "@/data/actions/template";

import { DownloadTemplateButton } from "./download-template-button";

const saveAsMock = saveAs as jest.MockedFunction<typeof saveAs>;
const toastMock = toast as jest.MockedFunction<typeof toast>;

const downloadTemplateMock = downloadTemplate as jest.MockedFunction<
   typeof downloadTemplate
>;

const assertRenderedMenuItem = () => {
   const downloadMenuItem = screen.getByTestId("download-template-menu-item");
   assertInDocument(downloadMenuItem);
};

const assertRenderedBtn = () => {
   const downloadBtn = screen.getByTestId("download-template-btn");
   assertInDocument(downloadBtn);
};

describe("DownloadTemplateButton rendering tests", () => {
   it("asMenuItem true - test", async () => {
      const descriptor = dtestData.dPrompt();
      const { container } = render(
         <DownloadTemplateButton descriptor={descriptor} asMenuItem={true} />
      );

      await waitFor(() => {
         assertRenderedMenuItem();
      });

      expect(container).toMatchSnapshot();
   });

   it("asMenuItem false - test", async () => {
      const descriptor = dtestData.dPrompt();
      const { container } = render(
         <DownloadTemplateButton descriptor={descriptor} asMenuItem={false} />
      );

      await waitFor(() => {
         assertRenderedBtn();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("DownloadTemplateButton functionality tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("download template btn clicked - result.success true - test", async () => {
      const result = {
         success: true,
         message: "data ready",
         data: "prompt template text",
      };
      downloadTemplateMock.mockResolvedValue(result);

      const descriptor = dtestData.dPrompt();
      render(
         <DownloadTemplateButton descriptor={descriptor} asMenuItem={true} />
      );

      await waitFor(() => {
         assertRenderedMenuItem();
         expect(downloadTemplateMock).not.toHaveBeenCalled();
      });

      const menuItem = screen.getByTestId("download-template-menu-item");
      await userEvent.click(menuItem);

      const blob = new Blob([result.data], {
         type: "application/json",
      });
      const downladedFileName = `${descriptor.title.replace(/\s+/g, "_")}.json`;

      await waitFor(() => {
         expect(downloadTemplateMock).toHaveBeenCalledTimes(1);
         expect(downloadTemplateMock).toHaveBeenCalledWith(descriptor.id);
         expect(saveAsMock).toHaveBeenCalledTimes(1);
         expect(saveAsMock).toHaveBeenCalledWith(blob, downladedFileName);
         expect(toastMock.success).toHaveBeenCalledTimes(1);
         expect(toastMock.success).toHaveBeenCalledWith(
            "Vorlage heruntergeladen!"
         );
      });
   });

   it("download template btn clicked - result.success false - test", async () => {
      const result = {
         success: false,
         message: "template cannot be downloaded",
      };
      downloadTemplateMock.mockResolvedValue(result);

      const descriptor = dtestData.dPrompt();
      render(<DownloadTemplateButton descriptor={descriptor} />);

      await waitFor(() => {
         assertRenderedBtn();
         expect(downloadTemplateMock).not.toHaveBeenCalled();
      });

      const downloadBtn = screen.getByTestId("download-template-btn");
      await userEvent.click(downloadBtn);

      await waitFor(() => {
         expect(downloadTemplateMock).toHaveBeenCalledTimes(1);
         expect(downloadTemplateMock).toHaveBeenCalledWith(descriptor.id);
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(result.message);
      });
   });
});
