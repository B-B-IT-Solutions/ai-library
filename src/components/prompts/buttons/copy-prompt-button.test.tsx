import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData, renderWithRouter } from "@tests";

import { CopyPromptButton } from "./copy-prompt-button";

const { writeText } = navigator.clipboard;

const writeTextMock = writeText as jest.MockedFunction<typeof writeText>;

const assertRendered = () => {
   const copyBtn = screen.getByTestId("copy-prompt-btn");
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

describe("CopyPromptButton rendering tests", () => {
   it("CopyPromptButton rendered", async () => {
      const prompt = dtestData.dPromptDescriptor();
      const { container } = renderWithRouter(
         <CopyPromptButton prompt={prompt} />
      );

      await waitFor(() => {
         assertRendered();
         assertCopyIcon();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("CopyPromptButton functionality tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("CopyPromptButton - copy btn clicked - success - test", async () => {
      const prompt = dtestData.dPromptDescriptor();
      renderWithRouter(<CopyPromptButton prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
         assertCopyIcon();
      });

      const copyBtn = screen.getByTestId("copy-prompt-btn");
      // expect(copyBtn).toHaveTextContent("Prompt in Zwischenablage kopieren");

      await userEvent.click(copyBtn);

      await waitFor(() => {
         expect(writeTextMock).toHaveBeenCalledWith(prompt.content);
         assertCheckIcon();
      });
   });

   it("CopyPromptButton - copy btn clicked - failed - test", async () => {
      const error = new Error("Clipboard error");
      writeTextMock.mockRejectedValue(error);
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      const prompt = dtestData.dPromptDescriptor();
      renderWithRouter(<CopyPromptButton prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
         assertCopyIcon();
      });

      const copyBtn = screen.getByTestId("copy-prompt-btn");
      await userEvent.click(copyBtn);

      await waitFor(() => {
         expect(consoleErrorSpy).toHaveBeenCalledWith("Failed to copy:", error);
         assertCopyIcon();
      });
   });

   it("CopyPromptButton - copy btn clicked - copied state resets after 2 seconds - test", async () => {
      const prompt = dtestData.dPromptDescriptor();
      renderWithRouter(<CopyPromptButton prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
         assertCopyIcon();
      });

      const copyBtn = screen.getByTestId("copy-prompt-btn");
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
