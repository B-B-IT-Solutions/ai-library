jest.mock("@/data/actions/prompt");
jest.mock("sonner");
jest.mock("file-saver");

import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData } from "@tests";
import { saveAs } from "file-saver";
import { toast } from "sonner";

import { downloadPrompt } from "@/data/actions/prompt";

import { DownloadPromptButton } from "./download-prompt-button";

const saveAsMock = saveAs as jest.MockedFunction<typeof saveAs>;
const toastMock = toast as jest.MockedFunction<typeof toast>;

const downloadPromptMock = downloadPrompt as jest.MockedFunction<
   typeof downloadPrompt
>;

const assertRenderedMenuItem = () => {
   const downloadMenuItem = screen.getByTestId("download-prompt-menu-item");
   assertInDocument(downloadMenuItem);
};

const assertRenderedBtn = () => {
   const downloadBtn = screen.getByTestId("download-prompt-btn");
   assertInDocument(downloadBtn);
};

describe("DownloadPromptButton rendering tests", () => {
   it("asMenuItem true - test", async () => {
      const descriptor = dtestData.dPrompt();
      const { container } = render(
         <DownloadPromptButton prompt={descriptor} asMenuItem={true} />
      );

      await waitFor(() => {
         assertRenderedMenuItem();
      });

      expect(container).toMatchSnapshot();
   });

   it("asMenuItem false - test", async () => {
      const descriptor = dtestData.dPrompt();
      const { container } = render(
         <DownloadPromptButton prompt={descriptor} asMenuItem={false} />
      );

      await waitFor(() => {
         assertRenderedBtn();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("DownloadPromptButton functionality tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("download template btn clicked - result.success true - test", async () => {
      const result = {
         success: true,
         message: "data ready",
         data: "prompt template text",
      };
      downloadPromptMock.mockResolvedValue(result);

      const descriptor = dtestData.dPrompt();
      render(<DownloadPromptButton prompt={descriptor} asMenuItem={true} />);

      await waitFor(() => {
         assertRenderedMenuItem();
         expect(downloadPromptMock).not.toHaveBeenCalled();
      });

      const menuItem = screen.getByTestId("download-prompt-menu-item");
      await userEvent.click(menuItem);

      const blob = new Blob([result.data], {
         type: "application/json",
      });
      const downladedFileName = `${descriptor.title.replace(/\s+/g, "_")}.json`;

      await waitFor(() => {
         expect(downloadPromptMock).toHaveBeenCalledTimes(1);
         expect(downloadPromptMock).toHaveBeenCalledWith(descriptor.id);
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
      downloadPromptMock.mockResolvedValue(result);

      const descriptor = dtestData.dPrompt();
      render(<DownloadPromptButton prompt={descriptor} />);

      await waitFor(() => {
         assertRenderedBtn();
         expect(downloadPromptMock).not.toHaveBeenCalled();
      });

      const downloadBtn = screen.getByTestId("download-prompt-btn");
      await userEvent.click(downloadBtn);

      await waitFor(() => {
         expect(downloadPromptMock).toHaveBeenCalledTimes(1);
         expect(downloadPromptMock).toHaveBeenCalledWith(descriptor.id);
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(result.message);
      });
   });
});
