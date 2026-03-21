import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { assertInDocument, renderWithTooltip } from "@tests";

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
      const content = "content 123";
      const { container } = renderWithTooltip(
         <CopyButton
            content={content}
            size="icon-sm"
            variant="secondary"
            className="absolute top-2 right-2 opacity-0"
            iconClassName="h-3.5 w-3.5"
         />
      );

      await waitFor(() => {
         assertRendered();
         assertCopyIcon();
      });

      expect(container).toMatchSnapshot();
   });

   it("CopyButton rendered", async () => {
      const content = "content 456";
      const { container } = renderWithTooltip(
         <CopyButton content={content} size="sm" showLabel={true} />
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
      const content = "content 123-1";
      renderWithTooltip(<CopyButton content={content} size="icon-sm" />);

      await waitFor(() => {
         assertRendered();
         assertCopyIcon();
      });

      const copyBtn = screen.getByTestId("copy-btn");
      await userEvent.click(copyBtn);

      await waitFor(() => {
         expect(writeTextMock).toHaveBeenCalledWith(content);
         assertCheckIcon();
      });
   });

   it("CopyButton - showLabel true - copy btn clicked - success - test", async () => {
      const content = "content 123-2";
      renderWithTooltip(
         <CopyButton content={content} size="sm" showLabel={true} />
      );

      await waitFor(() => {
         assertRendered();
         assertCopyIcon();
      });

      const copyBtn = screen.getByTestId("copy-btn");
      expect(copyBtn).toHaveTextContent("Kopieren");

      await userEvent.click(copyBtn);

      await waitFor(() => {
         expect(writeTextMock).toHaveBeenCalledWith(content);
         expect(copyBtn).toHaveTextContent("Kopiert");
         assertCheckIcon();
      });
   });

   it("CopyButton - copy btn clicked - failed - test", async () => {
      const error = new Error("Clipboard error");
      writeTextMock.mockRejectedValue(error);
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      const content = "content 123-3";
      renderWithTooltip(<CopyButton content={content} size="icon-sm" />);

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
      const content = "content 123-3";
      renderWithTooltip(<CopyButton content={content} size="icon-sm" />);

      await waitFor(() => {
         assertRendered();
         assertCopyIcon();
      });

      const copyBtn = screen.getByTestId("copy-btn");
      await userEvent.click(copyBtn);

      await waitFor(() => {
         expect(writeTextMock).toHaveBeenCalledWith(content);
         assertCheckIcon();
      });

      const options = { timeout: 3000 };
      await waitFor(() => {
         assertCopyIcon();
      }, options);
   });
});
