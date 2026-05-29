import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData } from "@tests";

import { PromptText } from "./prompt-text";

const { writeText } = navigator.clipboard;

const writeTextMock = writeText as jest.MockedFunction<typeof writeText>;

const assertRendered = () => {
   const text = screen.getByTestId("prompt-text");
   const copyBtn = screen.getByTestId("copy-btn");

   assertInDocument(text);
   assertInDocument(copyBtn);
};

describe("PromptText rendering tests", () => {
   it("rendered - test", async () => {
      const prompt = dtestData.dPromptWithContent();

      const { container } = render(<PromptText prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("PromptText functionality tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
      jest.clearAllMocks();
   });

   it("copy btn clicked - success - test", async () => {
      const prompt = dtestData.dPromptWithContent();

      render(<PromptText prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
      });

      const copyBtn = screen.getByTestId("copy-btn");
      expect(copyBtn).toHaveTextContent("Kopieren");

      await userEvent.click(copyBtn);

      await waitFor(() => {
         expect(writeTextMock).toHaveBeenCalledWith(prompt.content);
         expect(copyBtn).toHaveTextContent("Kopiert!");
      });
   });

   it("copy btn clicked - failed - test", async () => {
      const error = new Error("Clipboard error");
      writeTextMock.mockRejectedValue(error);
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      const prompt = dtestData.dPromptWithContent();
      render(<PromptText prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
      });

      const copyBtn = screen.getByTestId("copy-btn");
      await userEvent.click(copyBtn);

      await waitFor(() => {
         expect(consoleErrorSpy).toHaveBeenCalledWith("Failed to copy:", error);
         expect(copyBtn).toHaveTextContent("Kopieren");
      });
   });

   it("copy btn clicked - copied state resets after 2 seconds - test", async () => {
      const prompt = dtestData.dPromptWithContent();

      render(<PromptText prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
      });

      const copyBtn = screen.getByTestId("copy-btn");
      await userEvent.click(copyBtn);

      await waitFor(() => {
         expect(writeTextMock).toHaveBeenCalledWith(prompt.content);
         expect(copyBtn).toHaveTextContent("Kopiert!");
      });

      const options = { timeout: 3000 };
      await waitFor(() => {
         expect(copyBtn).toHaveTextContent("Kopieren");
      }, options);
   });
});
