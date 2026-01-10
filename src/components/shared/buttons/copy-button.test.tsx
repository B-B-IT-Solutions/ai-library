import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData, renderWithTooltip } from "@tests";

import { CopyButton } from "./copy-button";

const { writeText } = navigator.clipboard;

const writeTextMock = writeText as jest.MockedFunction<typeof writeText>;

const assertRendered = () => {
   const copyBtn = screen.getByTestId("copy-btn");
   assertInDocument(copyBtn);
};

const assertCheckIcon = () => {
   const check = screen.getByTestId("check-icon");
   assertInDocument(check);
};

const assertCopyIcon = () => {
   const copy = screen.getByTestId("copy-icon");
   assertInDocument(copy);
};

describe("CopyButton rendering tests", () => {
   it("CopyButton rendered", async () => {
      const prompt = dtestData.dPromptDescriptor();
      const { container } = renderWithTooltip(
         <CopyButton
            prompt={prompt}
            size="icon-sm"
            className="absolute top-2 right-2 opacity-0"
         />
      );

      await waitFor(() => {
         assertRendered();
         assertCopyIcon();
      });

      expect(container).toMatchSnapshot();
   });

   it("CopyButton rendered", async () => {
      const prompt = dtestData.dPromptDescriptor();
      const { container } = renderWithTooltip(
         <CopyButton prompt={prompt} size="sm" showLabel={true} />
      );

      await waitFor(() => {
         assertRendered();
         assertCopyIcon();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("CopyButton functionality tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("CopyButton - showLabel false - copy btn clicked - success - test", async () => {
      const prompt = dtestData.dPromptDescriptor();
      renderWithTooltip(<CopyButton prompt={prompt} size="icon-sm" />);

      await waitFor(() => {
         assertRendered();
         assertCopyIcon();
      });

      const copyBtn = screen.getByTestId("copy-btn");
      await userEvent.click(copyBtn);

      await waitFor(() => {
         expect(writeTextMock).toHaveBeenCalledWith(prompt.content);
         assertCheckIcon();
      });
   });

   it("CopyButton - showLabel true - copy btn clicked - success - test", async () => {
      const prompt = dtestData.dPromptDescriptor();
      renderWithTooltip(
         <CopyButton prompt={prompt} size="sm" showLabel={true} />
      );

      await waitFor(() => {
         assertRendered();
         assertCopyIcon();
      });

      const copyBtn = screen.getByTestId("copy-btn");
      expect(copyBtn).toHaveTextContent("Kopieren");

      await userEvent.click(copyBtn);

      await waitFor(() => {
         expect(writeTextMock).toHaveBeenCalledWith(prompt.content);
         expect(copyBtn).toHaveTextContent("Kopiert");
         assertCheckIcon();
      });
   });

   it("CopyButton - copy btn clicked - failed - test", async () => {
      const error = new Error("Clipboard error");
      writeTextMock.mockRejectedValue(error);
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      const prompt = dtestData.dPromptDescriptor();
      renderWithTooltip(<CopyButton prompt={prompt} size="icon-sm" />);

      await waitFor(() => {
         assertRendered();
         assertCopyIcon();
      });

      const copyBtn = screen.getByTestId("copy-btn");
      await userEvent.click(copyBtn);

      await waitFor(() => {
         expect(consoleErrorSpy).toHaveBeenCalledWith("Failed to copy:", error);
         assertCopyIcon();
      });
   });

   it("CopyButton - copy btn clicked - copied state resets after 2 seconds - test", async () => {
      const prompt = dtestData.dPromptDescriptor();
      renderWithTooltip(<CopyButton prompt={prompt} size="icon-sm" />);

      await waitFor(() => {
         assertRendered();
         assertCopyIcon();
      });

      const copyBtn = screen.getByTestId("copy-btn");
      await userEvent.click(copyBtn);

      await waitFor(() => {
         expect(writeTextMock).toHaveBeenCalledWith(prompt.content);
         assertCheckIcon();
      });

      const options = { timeout: 3000 };
      await waitFor(() => {
         assertCopyIcon();
      }, options);
   });
});
