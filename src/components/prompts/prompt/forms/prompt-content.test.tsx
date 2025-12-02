import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData } from "@tests";

import { PromptContent } from "./prompt-content";

const errorFn = jest.fn();
const consoleErrorOriginal = console.error;

const assertRendered = () => {
   const content = screen.getByTestId("prompt-content");
   assertInDocument(content);
};

const assertExpanded = () => {
   const chevron = screen.getByTestId("chevron-down");
   assertInDocument(chevron);
};

const assertNotExpanded = () => {
   const chevron = screen.getByTestId("chevron-right");
   assertInDocument(chevron);
};

const assertCopyIcon = () => {
   const copy = screen.getByTestId("copy-icon");
   assertInDocument(copy);
};

const assertCheckIcon = () => {
   const check = screen.getByTestId("check-icon");
   assertInDocument(check);
};

describe("PromptContent rendering tests", () => {
   it("PromptContent - expanded false - rendered test", async () => {
      const prompt = dtestData.dPrompt();

      const { container } = render(<PromptContent prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
         assertNotExpanded();
         assertCopyIcon();
      });

      expect(container).toMatchSnapshot();
   });

   it("PromptContent - expanded true - rendered test", async () => {
      const prompt = dtestData.dPrompt();

      const { container } = render(<PromptContent prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
         assertNotExpanded();
         assertCopyIcon();
      });

      expect(container).toMatchSnapshot();

      const expandToggle = screen.getByTestId("expand-toggle");
      userEvent.click(expandToggle);

      await waitFor(() => {
         assertExpanded();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("PromptContent functionality tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
      console.error = errorFn;
   });

   afterEach(() => {
      console.error = consoleErrorOriginal;
   });

   it("PromptContent - expand btn clicked - test", async () => {
      const prompt = dtestData.dPrompt();

      render(<PromptContent prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
         assertNotExpanded();
      });

      const expandToggle = screen.getByTestId("expand-toggle");
      userEvent.click(expandToggle);

      await waitFor(() => {
         assertExpanded();
      });
   });

   it("PromptContent - copy btn clicked - test", async () => {
      const prompt = dtestData.dPrompt();
      render(<PromptContent prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
         assertCopyIcon();
         expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
      });

      await waitFor(() => {
         const copyBtn = screen.getByTestId("copy-btn");
         userEvent.click(copyBtn);
      });

      await waitFor(() => {
         assertCheckIcon();
         expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
         expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
            prompt.content
         );
      });

      const options = { timeout: 3000 };
      await waitFor(() => {
         assertCopyIcon();
      }, options);
   });
   it("PromptContent - clipboard copy error - test", async () => {
      const writeTextMock = navigator.clipboard
         .writeText as jest.MockedFunction<
         typeof navigator.clipboard.writeText
      >;
      writeTextMock.mockRejectedValue("error 1");

      const prompt = dtestData.dPrompt();
      render(<PromptContent prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
         assertCopyIcon();
         expect(errorFn).not.toHaveBeenCalled();
         expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
      });

      await waitFor(() => {
         const copyBtn = screen.getByTestId("copy-btn");
         userEvent.click(copyBtn);
      });

      await waitFor(() => {
         assertCopyIcon();
         expect(errorFn).toHaveBeenCalledTimes(1);
         expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
         expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
            prompt.content
         );
      });
   });
});
