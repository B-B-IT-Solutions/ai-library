import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument } from "@tests";

import { StatusBadge } from "./status-badge";

const assertRendered = () => {
   const badge = screen.getByTestId("status-badge");
   assertInDocument(badge);
};

const assertBadgeUsedRendered = () => {
   const text = screen.getByText("Im Prompt verwendet");
   assertInDocument(text);
};

const assertBadgeNotUsedRendered = () => {
   const text = screen.getByText("Nicht verwendet");
   assertInDocument(text);
};

describe("StatusBadge rendering tests", () => {
   it("hasName false - test", () => {
      const { container } = render(
         <StatusBadge hasName={false} isUsed={true} />
      );

      expect(container.children.length).toEqual(0);
   });

   it("hasName true - isUsed true - test", async () => {
      const { container } = render(
         <StatusBadge hasName={true} isUsed={true} />
      );

      await waitFor(() => {
         assertRendered();
         assertBadgeUsedRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("hasName true - isUsed false - test", async () => {
      const { container } = render(
         <StatusBadge hasName={true} isUsed={false} />
      );

      await waitFor(() => {
         assertRendered();
         assertBadgeNotUsedRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
