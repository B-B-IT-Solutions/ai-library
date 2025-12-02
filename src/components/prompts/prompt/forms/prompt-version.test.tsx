import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData } from "@tests";

import { PromptVersion } from "./prompt-version";

const assertRendered = () => {
   const version = screen.getByTestId("prompt-version");
   assertInDocument(version);
};

const assertExpanded = () => {
   const chevron = screen.getByTestId("chevron-down");
   assertInDocument(chevron);
};

const assertNotExpanded = () => {
   const chevron = screen.getByTestId("chevron-right");
   assertInDocument(chevron);
};

describe("PromptVersion rendering tests", () => {
   it("PromptVersion - isCurrent false - rendered test", async () => {
      const version = dtestData.dPromptVersion();

      const { container } = render(
         <PromptVersion version={version} isCurrent={false} />
      );

      await waitFor(() => {
         assertRendered();
         assertNotExpanded();
      });

      expect(container).toMatchSnapshot();
   });

   it("PromptVersion - isCurrent true - rendered test", async () => {
      const version = dtestData.dPromptVersion();

      const { container } = render(
         <PromptVersion version={version} isCurrent={true} />
      );

      await waitFor(() => {
         assertRendered();
         assertNotExpanded();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("PromptVersion functionality tests", () => {
   it("PromptVersion - expand btn clicked - test", async () => {
      const version = dtestData.dPromptVersion();

      render(<PromptVersion version={version} isCurrent={true} />);

      await waitFor(() => {
         assertRendered();
         assertNotExpanded();
      });

      const expandBtn = screen.getByTestId("expand-btn");
      userEvent.click(expandBtn);

      await waitFor(() => {
         assertExpanded();
      });
   });
});
