import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument, dtestData } from "@tests";

import { PromptTextDisplay } from "./prompt-text-display";

const { writeText } = navigator.clipboard;

const writeTextMock = writeText as jest.MockedFunction<typeof writeText>;

const assertRendered = () => {
   const content = screen.getByTestId("prompt-text");
   const expandToggle = screen.getByTestId("expand-toggle");
   const headline = screen.getByTestId("headline");
   const copyBtn = screen.getByTestId("copy-btn");

   assertInDocument(content);
   assertInDocument(expandToggle);
   assertInDocument(headline);
   assertInDocument(copyBtn);
};

const assertContentRendered = () => {
   const content = screen.getByTestId("content");
   assertInDocument(content);
};

const assertContentNotRendered = () => {
   const content = screen.queryByTestId("content");
   assertNotInDocument(content);
};

describe("PromptTextDisplay rendering tests", () => {
   it("PromptTextDisplay rendered test", async () => {
      const template = dtestData.dPromptWithContent();

      const { container } = render(<PromptTextDisplay template={template} />);

      await waitFor(() => {
         assertRendered();
         assertContentRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("PromptTextDisplay functionality tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
      jest.clearAllMocks();
   });

   it("PromptTextDisplay - expand btn clicked - test", async () => {
      const template = dtestData.dPromptWithContent();

      render(<PromptTextDisplay template={template} />);

      await waitFor(() => {
         assertRendered();
         assertContentRendered();
      });

      const expandToggle = screen.getByTestId("expand-toggle");
      await userEvent.click(expandToggle);

      await waitFor(() => {
         assertContentNotRendered();
      });
   });

   it("PromptTextDisplay - expand btn clicked twice - content re-expands", async () => {
      const template = dtestData.dPromptWithContent();

      render(<PromptTextDisplay template={template} />);

      await waitFor(() => {
         assertRendered();
         assertContentRendered();
      });

      const expandToggle = screen.getByTestId("expand-toggle");
      await userEvent.click(expandToggle);

      await waitFor(() => {
         assertContentNotRendered();
      });

      await userEvent.click(expandToggle);

      await waitFor(() => {
         assertContentRendered();
      });
   });

   it("PromptTextDisplay - copy btn clicked - success - test", async () => {
      const template = dtestData.dPromptWithContent();

      render(<PromptTextDisplay template={template} />);

      await waitFor(() => {
         assertRendered();
      });

      const copyBtn = screen.getByTestId("copy-btn");
      expect(copyBtn).toHaveTextContent("Kopieren");

      await userEvent.click(copyBtn);

      await waitFor(() => {
         expect(writeTextMock).toHaveBeenCalledWith(template.content);
         expect(copyBtn).toHaveTextContent("Kopiert!");
      });
   });

   it("PromptTextDisplay - copy btn clicked - failed - test", async () => {
      const error = new Error("Clipboard error");
      writeTextMock.mockRejectedValue(error);
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      const template = dtestData.dPromptWithContent();
      render(<PromptTextDisplay template={template} />);

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

   it("PromptTextDisplay - copy btn clicked - copied state resets after 2 seconds - test", async () => {
      const template = dtestData.dPromptWithContent();

      render(<PromptTextDisplay template={template} />);

      await waitFor(() => {
         assertRendered();
      });

      const copyBtn = screen.getByTestId("copy-btn");
      await userEvent.click(copyBtn);

      await waitFor(() => {
         expect(writeTextMock).toHaveBeenCalledWith(template.content);
         expect(copyBtn).toHaveTextContent("Kopiert!");
      });

      const options = { timeout: 3000 };
      await waitFor(() => {
         expect(copyBtn).toHaveTextContent("Kopieren");
      }, options);
   });
});
